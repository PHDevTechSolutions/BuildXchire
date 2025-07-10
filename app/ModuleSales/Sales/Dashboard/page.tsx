"use client";

import React, { useState, useEffect, useRef } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import { ToastContainer, toast } from "react-toastify";

import Chart from "../../components/Chart/ActivityChart";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue in Leaflet (important!)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DashboardPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    UserId: "",
    ReferenceID: "",
    Manager: "",
    TSM: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Role: "",
    Department: "",
    Company: "",
  });
  const [posts, setPosts] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Reference to the Leaflet map instance
  const mapRef = useRef<L.Map | null>(null);

  const fetchAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ModuleSales/Activity/FetchLog");
      const data = await res.json();
      setPosts(data.data);
    } catch (error) {
      toast.error("Error fetching activity logs.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const filteredAccounts = Array.isArray(posts)
    ? posts
        .filter((post) => {
          const postDate = post.date_created ? new Date(post.date_created) : null;

          const isWithinDateRange =
            (!startDate || (postDate && postDate >= new Date(startDate))) &&
            (!endDate || (postDate && postDate <= new Date(endDate)));

          const matchesReferenceID =
            post?.referenceid === userDetails.ReferenceID ||
            post?.ReferenceID === userDetails.ReferenceID;

          return isWithinDateRange && matchesReferenceID;
        })
        .sort(
          (a, b) =>
            new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
        )
    : [];

  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (!userId) return;

      try {
        const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserDetails({
          UserId: data._id,
          ReferenceID: data.ReferenceID || "",
          Manager: data.Manager || "",
          TSM: data.TSM || "",
          Firstname: data.Firstname || "",
          Lastname: data.Lastname || "",
          Email: data.Email || "",
          Role: data.Role || "",
          Department: data.Department || "",
          Company: data.Company || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, []);

  // Prepare data for line chart: count activities grouped by date (YYYY-MM-DD)
  const activityCountByDate = filteredAccounts.reduce<Record<string, number>>((acc, post) => {
    if (!post.date_created) return acc;
    const date = new Date(post.date_created).toISOString().slice(0, 10); // YYYY-MM-DD
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Convert to array sorted by date ascending for chart
  const chartData = Object.entries(activityCountByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  // Map data aggregation
  type LocationKey = string; // e.g. "14.6095|121.0374"
  interface LocationCount {
    latitude: number;
    longitude: number;
    count: number;
    locationName?: string; // Location from post.Location
  }

  const locationCountsMap = new Map<LocationKey, LocationCount>();

  filteredAccounts.forEach((post) => {
    if (post.Latitude && post.Longitude) {
      const lat = Number(post.Latitude);
      const lon = Number(post.Longitude);
      if (isNaN(lat) || isNaN(lon)) return;

      const key = `${lat.toFixed(4)}|${lon.toFixed(4)}`;

      const locName = post.Location || "";

      if (locationCountsMap.has(key)) {
        const existing = locationCountsMap.get(key)!;
        existing.count += 1;
        if (!existing.locationName && locName) {
          existing.locationName = locName;
        }
      } else {
        locationCountsMap.set(key, { latitude: lat, longitude: lon, count: 1, locationName: locName });
      }
    }
  });

  const locationCounts = Array.from(locationCountsMap.values());

  // Choose center of map as first location or a default fallback
  const mapCenter: [number, number] = locationCounts.length
    ? [locationCounts[0].latitude, locationCounts[0].longitude]
    : [14.5995, 120.9842]; // Manila fallback

  // Handler for when user clicks a location in the list
  const handleLocationClick = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo([latitude, longitude], 15, {
        duration: 1.5,
      });
    }
  };

  // Custom component to get the map instance and assign it to mapRef
  const SetMapRef: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      mapRef.current = map;
    }, [map]);
    return null;
  };

  // MapCard Component
  const MapCard = () => (
    <div className="bg-white shadow rounded-lg p-6 mt-6 flex flex-col md:flex-row gap-6">
      <div className="md:w-2/3 h-96">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <SetMapRef />
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locationCounts.map(({ latitude, longitude, count, locationName }, i) => (
            <Marker key={i} position={[latitude, longitude]}>
              <Popup>
                Visited {count} time{count > 1 ? "s" : ""}
                <br />
                {locationName ? (
                  <>
                    {locationName} <br /> ({latitude.toFixed(5)}, {longitude.toFixed(5)})
                  </>
                ) : (
                  <>({latitude.toFixed(5)}, {longitude.toFixed(5)})</>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="md:w-1/3 overflow-auto max-h-96 text-xs">
        <h3 className="font-semibold mb-2">Location Visit Counts</h3>
        <ul>
          {locationCounts.length === 0 && <li>No location data available.</li>}
          {locationCounts.map(({ latitude, longitude, count, locationName }, i) => (
            <li
              key={i}
              className="mb-1 cursor-pointer hover:text-blue-600"
              onClick={() => handleLocationClick(latitude, longitude)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleLocationClick(latitude, longitude);
                }
              }}
            >
              <strong>{count}</strong> visit{count > 1 ? "s" : ""} at{" "}
              {locationName
                ? `${locationName} (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`
                : `(${latitude.toFixed(5)}, ${longitude.toFixed(5)})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Activities Over Time Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-center">Activities Over Time</h2>
            <Chart data={chartData} />
          </div>

          {/* Map Card */}
          <MapCard />
        </div>
        <ToastContainer className="text-xs" autoClose={1000} />
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
