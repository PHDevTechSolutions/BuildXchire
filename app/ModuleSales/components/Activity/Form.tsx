import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Camera from "./Camera";

interface FormData {
  ReferenceID: string;
  Email: string;
  Type: string;
  Status: string;
  PhotoURL?: string;
  _id?: string;
}

interface UserDetails {
  ReferenceID: string;
  Email: string;
}

interface FormProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  userDetails: UserDetails;
  fetchAccount: () => Promise<void>;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const Form: React.FC<FormProps> = ({
  formData,
  onChange,
  userDetails,
  fetchAccount,
  setForm,
  setShowForm,
}) => {
  const [statusOptions, setStatusOptions] = useState<string[]>(["Login"]);
  const [locationAddress, setLocationAddress] = useState<string>("Fetching location...");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera and get location
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      })
      .catch((err) => {
        console.error("Camera error:", err);
        toast.error("Cannot access camera");
      });

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`)
          .then((res) => res.json())
          .then((data) => {
            setLocationAddress(data.display_name || `${coords.latitude}, ${coords.longitude}`);
          })
          .catch(() => {
            setLocationAddress(`${coords.latitude}, ${coords.longitude}`);
          });
      },
      () => {
        setLocationAddress("Location unavailable");
      }
    );

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const uploadToCloudinary = async (base64Image: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", base64Image);
    formData.append("upload_preset", "Xchire");
    const res = await fetch("https://api.cloudinary.com/v1_1/dhczsyzcz/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const checkIfLoggedInToday = async (type: string) => {
    if (!type) {
      setStatusOptions(["Login"]);
      return;
    }
    try {
      const res = await fetch("/api/ModuleSales/Activity/FetchLog");
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const userRefId = userDetails.ReferenceID.toLowerCase();
      const logsToday = data.data.filter((log: any) => {
        const d = new Date(log.date_created);
        d.setHours(0, 0, 0, 0);
        return (
          (log.ReferenceID?.toLowerCase() === userRefId || log.referenceid?.toLowerCase() === userRefId) &&
          log.Type === type &&
          d.getTime() === today.getTime()
        );
      });
      const hasActiveLogin = logsToday.some((log: any) => {
        if (log.Status === "Login") {
          const logoutAfter = logsToday.find(
            (l: any) =>
              l.Status === "Logout" &&
              new Date(l.date_created) > new Date(log.date_created)
          );
          return !logoutAfter;
        }
        return false;
      });
      setStatusOptions(hasActiveLogin ? ["Logout"] : ["Login"]);
      if (hasActiveLogin && formData.Status === "Login") {
        onChange("Status", "");
      }
    } catch (err) {
      console.error(err);
      setStatusOptions(["Login", "Logout"]);
    }
  };

  useEffect(() => {
    checkIfLoggedInToday(formData.Type);
  }, [formData.Type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!capturedImage) {
        toast.error("Please capture a photo first.");
        return;
      }

      setUploading(true);
      const photoURL = await uploadToCloudinary(capturedImage);

      const method = formData._id ? "PUT" : "POST";
      const url = formData._id
        ? `/api/ModuleSales/Activity/UpdateLog?id=${formData._id}`
        : `/api/ModuleSales/Activity/AddLog`;

      const payload = {
        ...formData,
        Location: locationAddress,
        Latitude: latitude,
        Longitude: longitude,
        PhotoURL: photoURL,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success(formData._id ? "Activity updated!" : "Activity added!");
      setCapturedImage(null);
      setForm({
        ReferenceID: userDetails.ReferenceID,
        Email: userDetails.Email,
        Type: "",
        Status: "",
        PhotoURL: "",
        _id: undefined,
      });
      setShowForm(false);
      await fetchAccount();
    } catch (err) {
      console.error(err);
      toast.error("Error saving activity.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={() => setShowForm(false)} />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative p-6">
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xs"
          >
            &#x2715;
          </button>
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <h3 className="text-lg font-semibold mb-2">{formData._id ? "Update Activity" : "Add Activity"}</h3>

            <div>
              <label className="block mb-1">Type</label>
              <select
                className="w-full border-b border-gray-300 px-2 py-1 text-xs bg-white"
                value={formData.Type}
                onChange={e => onChange("Type", e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="HR Attendance">HR Attendance</option>
                <option value="On Field">On Field</option>
                <option value="Site Visit">Site Visit</option>
                <option value="On Site">On Site</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Status</label>
              <select
                className="w-full border-b border-gray-300 px-2 py-1 text-xs bg-white"
                value={formData.Status}
                onChange={e => onChange("Status", e.target.value)}
                required
                disabled={!formData.Type}
              >
                <option value="">Select Status</option>
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Location</label>
              <input
                type="text"
                value={locationAddress}
                disabled
                className="w-full border-b bg-white border-gray-300 px-2 py-1 text-xs"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={latitude ?? ""}
                disabled
                placeholder="Latitude"
                className="w-1/2 border-b bg-white border-gray-300 px-2 py-1 text-xs"
              />
              <input
                type="text"
                value={longitude ?? ""}
                disabled
                placeholder="Longitude"
                className="w-1/2 border-b bg-white border-gray-300 px-2 py-1 text-xs"
              />
            </div>

            <Camera onCapture={(img) => setCapturedImage(img)} />

            <button
              type="submit"
              className="w-full bg-black text-white px-4 py-2 rounded text-xs mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !formData.Type ||
                !formData.Status ||
                uploading ||
                !capturedImage ||
                !locationAddress ||
                locationAddress === "Location unavailable" ||
                locationAddress === "Fetching location..."
              }
            >
              {uploading ? "Uploading..." : formData._id ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Form;
