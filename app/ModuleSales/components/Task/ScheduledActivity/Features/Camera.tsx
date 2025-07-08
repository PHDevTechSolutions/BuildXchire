import React, { useEffect, useRef, useState } from "react";

interface CameraProps {
  imageBlob: Blob | null;
  setImageBlob: (blob: Blob | null) => void;
  onCapture?: (blob: Blob) => void;
}

const Camera: React.FC<CameraProps> = ({ imageBlob, setImageBlob, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [loading, setLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [brightness, setBrightness] = useState<number>(1); // CSS filter brightness (1 = normal)

  // Start / stop camera
  useEffect(() => {
    if (!imageBlob) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [imageBlob]);

  // Analyze brightness periodically
  useEffect(() => {
    if (!videoRef.current) return;

    let intervalId: number | null = null;

    const analyzeBrightness = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get pixel data
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;

      // Calculate average brightness (simple avg of RGB)
      let colorSum = 0;
      const pixels = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // luminance formula (weighted average for human eye perception)
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        colorSum += luminance;
      }
      const avgBrightness = colorSum / pixels;

      // Normalize to 0-1 (0 = dark, 255 = bright)
      const normalized = avgBrightness / 255;

      // Map normalized brightness to CSS brightness filter (e.g. brighten if < 0.5)
      // We'll brighten up to 1.8 max when really dark, normal at 1 for bright enough
      const filterBrightness = normalized < 0.5 ? 1 + (0.5 - normalized) * 1.6 : 1;

      setBrightness(filterBrightness);
    };

    intervalId = window.setInterval(analyzeBrightness, 1000); // every second

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [videoRef, canvasRef]);

  const startCamera = async () => {
    setLoading(true);
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((err) =>
            console.warn("Autoplay failed:", err)
          );
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Unable to access your camera.");
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            setImageBlob(blob);
            setPreviewUrl(URL.createObjectURL(blob)); // store preview URL
            onCapture?.(blob);
          }
        }, "image/jpeg");
      }
    }
  };

  const retakePhoto = () => {
    setImageBlob(null);
    setPreviewUrl("");
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-xs font-semibold text-gray-700 mb-3">Camera 📷</h3>

      {loading && <p className="text-xs text-gray-500 mb-2">Loading camera...</p>}
      {cameraError && <p className="text-xs text-red-500">{cameraError}</p>}

      <canvas
        ref={canvasRef}
        width="320"
        height="240"
        style={{ display: "none" }}
      />

      {!imageBlob && !cameraError && (
        <>
          <div className="relative flex justify-center mb-3">
            <video
              ref={videoRef}
              width="320"
              height="240"
              className="rounded-md border-2 border-red-400 shadow-md w-[390px]"
              style={{ filter: `brightness(${brightness})` }}
            />

            {previewUrl && (
              <div className="absolute bottom-2 right-2 border rounded overflow-hidden shadow-sm bg-white">
                <img
                  src={previewUrl}
                  alt="Thumbnail"
                  className="w-[80px] h-[60px] object-cover"
                />
              </div>
            )}
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={captureImage}
              disabled={loading}
              className="bg-black hover:bg-cyan-400 text-white text-xs px-4 py-2 rounded shadow-sm transition"
            >
              Capture Photo
            </button>
          </div>
        </>
      )}

      {imageBlob && (
        <>
          <div className="flex justify-center mb-2">
            <img
              src={previewUrl}
              alt="Captured"
              className="rounded-md border-2 border-cyan-400 shadow-md w-[390px]"
            />
          </div>
          <p className="text-green-600 text-center text-xs font-medium">
            ✅ Image captured and ready for submission.
          </p>
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={retakePhoto}
              className="bg-black hover:bg-cyan-400 text-white text-xs px-4 py-2 rounded shadow-sm transition"
            >
              Retake Photo
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Camera;
