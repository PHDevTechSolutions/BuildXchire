"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SidebarListing from "../../components/Chart/SidebarListing";

/* ---------- leaflet icon fix ---------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* ---------- constants ---------- */
const ORIGIN = { lat: 14.60023, lon: 121.05945 }; // main address / HQ
const WALK_KMH = 5; // average walking speed km/h
const DRIVE_KMH = 30; // conservative city driving speed km/h

interface Post {
  Latitude?: number | string;
  Longitude?: number | string;
  Location?: string;
  DateVisited?: string | number; // optional
}

interface Props {
  posts: Post[];
}

/* ---------- helper component to store map ref ---------- */
const SetMapRef: React.FC<{ setMap: (m: L.Map) => void }> = ({ setMap }) => {
  const m = useMap();
  useEffect(() => void setMap(m), [m]);
  return null;
};

/* ---------- utility: haversine formula for distance in km ---------- */
const toRad = (deg: number) => (deg * Math.PI) / 180;
const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const fmtTime = (hours: number) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h > 0 ? h + "h " : ""}${m}m`;
};

/* ---------- main component ---------- */
const MapCard: React.FC<Props> = ({ posts }) => {
  const mapRef = useRef<L.Map | null>(null);

  /* ---------- aggregate visit counts by lat/lon ---------- */
  const locMap = new Map<
    string,
    { lat: number; lon: number; cnt: number; name?: string }
  >();
  posts.forEach((p) => {
    if (!p.Latitude || !p.Longitude) return;
    const lat = +p.Latitude,
      lon = +p.Longitude;
    if (Number.isNaN(lat) || Number.isNaN(lon)) return;
    const key = `${lat.toFixed(4)}|${lon.toFixed(4)}`;
    const name = p.Location ?? "";
    if (locMap.has(key)) {
      const e = locMap.get(key)!;
      e.cnt += 1;
      if (!e.name && name) e.name = name;
    } else {
      locMap.set(key, { lat, lon, cnt: 1, name });
    }
  });
  const locations = [...locMap.values()];

  /* ---------- derive center of map ---------- */
  const center: [number, number] =
    locations.length > 0 ? [locations[0].lat, locations[0].lon] : [ORIGIN.lat, ORIGIN.lon];

  /* ---------- user location state ---------- */
  const [userPos, setUserPos] = useState<{
    lat: number;
    lon: number;
    accuracy: number;
  } | null>(null);
  const [locating, setLocating] = useState(false);

  /* ---------- handle locate me ---------- */
  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserPos({ lat: latitude, lon: longitude, accuracy });
        mapRef.current?.flyTo([latitude, longitude], 15, { duration: 1.25 });
        setLocating(false);
      },
      (err) => {
        console.error(err);
        alert("Unable to retrieve your location.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  /* ---------- calculate distances and estimated times ---------- */
  const locsWithDist = useMemo(
    () =>
      locations.map((l) => {
        const dist = haversineKm(ORIGIN.lat, ORIGIN.lon, l.lat, l.lon);
        return {
          ...l,
          dist,
          walkTime: fmtTime(dist / WALK_KMH),
          driveTime: fmtTime(dist / DRIVE_KMH),
        };
      }),
    [locations]
  );

  /* ---------- flyTo helper ---------- */
  const flyTo = (lat: number, lon: number) =>
    mapRef.current?.flyTo([lat, lon], 15, { duration: 1.25 });

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6 flex flex-col md:flex-row gap-6">
      {/* Map container */}
      <div className="relative md:w-2/3 h-96">
        <button
          onClick={handleLocate}
          className="absolute z-[1000] top-2 right-2 bg-black text-white text-xs font-semibold px-3 py-1 rounded shadow hover:bg-blue-700 focus:outline-none"
        >
          {locating ? "Locating…" : "Locate Me"}
        </button>

        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <SetMapRef setMap={(m) => (mapRef.current = m)} />
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Origin Marker */}
          <Marker position={[ORIGIN.lat, ORIGIN.lon]}>
            <Popup>
              HQ / Origin
              <br />
              ({ORIGIN.lat}, {ORIGIN.lon})
            </Popup>
          </Marker>

          {/* Markers with polyline and tooltip */}
          {locsWithDist.map(
            ({ lat, lon, cnt, name, dist, walkTime, driveTime }, i) => (
              <React.Fragment key={i}>
                <Marker position={[lat, lon]}>
                  <Popup>
                    Visited {cnt} time{cnt > 1 ? "s" : ""}
                    <br />
                    Distance from HQ: {dist.toFixed(2)} km
                    <br />
                    Walking: ~{walkTime}
                    <br />
                    Driving: ~{driveTime}
                    <br />
                    {name ? (
                      <>
                        {name}
                        <br />
                        ({lat.toFixed(5)}, {lon.toFixed(5)})
                      </>
                    ) : (
                      <>({lat.toFixed(5)}, {lon.toFixed(5)})</>
                    )}
                  </Popup>
                </Marker>

                <Polyline
                  positions={[
                    [ORIGIN.lat, ORIGIN.lon],
                    [lat, lon],
                  ]}
                  pathOptions={{ weight: 1, dashArray: "4 4" }}
                >
                  <Tooltip sticky direction="center" offset={[0, 0]}>
                    {dist.toFixed(2)} km • 🚶‍♂️ {walkTime} • 🚗 {driveTime}
                  </Tooltip>
                </Polyline>
              </React.Fragment>
            )
          )}

          {/* User location */}
          {userPos && (
            <>
              <Marker position={[userPos.lat, userPos.lon]}>
                <Popup>You are here.</Popup>
              </Marker>
              <Circle
                center={[userPos.lat, userPos.lon]}
                radius={userPos.accuracy}
                pathOptions={{ color: "#1d4ed8", fillOpacity: 0.1 }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {/* Sidebar listing */}
      <SidebarListing locsWithDist={locsWithDist} flyTo={flyTo} />
    </div>
  );
};

export default MapCard;
