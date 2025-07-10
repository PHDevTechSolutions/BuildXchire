"use client";

import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* leaflet icon fix */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Post {
  Latitude?: number | string;
  Longitude?: number | string;
  Location?: string;
}

interface Props {
  posts: Post[];
}

const MapCard: React.FC<Props> = ({ posts }) => {
  const mapRef = useRef<L.Map | null>(null);

  /* aggregate */
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
  const center: [number, number] =
    locations.length > 0
      ? [locations[0].lat, locations[0].lon]
      : [14.5995, 120.9842];

  /* helpers */
  const SetMapRef = () => {
    const m = useMap();
    useEffect(() => void (mapRef.current = m), [m]);
    return null;
  };
  const flyTo = (lat: number, lon: number) =>
    mapRef.current?.flyTo([lat, lon], 15, { duration: 1.5 });

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6 flex flex-col md:flex-row gap-6">
      <div className="md:w-2/3 h-96">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <SetMapRef />
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map(({ lat, lon, cnt, name }, i) => (
            <Marker key={i} position={[lat, lon]}>
              <Popup>
                Visited {cnt} time{cnt > 1 ? "s" : ""}
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
          ))}
        </MapContainer>
      </div>

      <div className="md:w-1/3 overflow-auto max-h-96 text-xs">
        <h3 className="font-semibold mb-2">Location Visit Counts</h3>
        <ul>
          {locations.length === 0 && <li>No location data available.</li>}
          {locations.map(({ lat, lon, cnt, name }, i) => (
            <li
              key={i}
              className="mb-1 cursor-pointer hover:text-blue-600"
              onClick={() => flyTo(lat, lon)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") flyTo(lat, lon);
              }}
            >
              <strong>{cnt}</strong> visit{cnt > 1 ? "s" : ""} at{" "}
              {name
                ? `${name} (${lat.toFixed(5)}, ${lon.toFixed(5)})`
                : `(${lat.toFixed(5)}, ${lon.toFixed(5)})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapCard;
