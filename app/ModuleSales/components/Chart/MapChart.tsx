"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationCount {
  latitude: number;
  longitude: number;
  count: number;
}

interface MapProps {
  locationCounts: LocationCount[];
  mapCenter: [number, number];
}

const Map: React.FC<MapProps> = ({ locationCounts, mapCenter }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6 flex flex-col md:flex-row gap-6">
      <div className="md:w-2/3 h-96">
        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locationCounts.map(({ latitude, longitude, count }, i) => (
            <Marker key={i} position={[latitude, longitude]}>
              <Popup>
                Visited {count} time{count > 1 ? "s" : ""}
                <br />
                ({latitude.toFixed(5)}, {longitude.toFixed(5)})
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="md:w-1/3 overflow-auto max-h-96 text-xs">
        <h3 className="font-semibold mb-2">Location Visit Counts</h3>
        <ul>
          {locationCounts.length === 0 && <li>No location data available.</li>}
          {locationCounts.map(({ latitude, longitude, count }, i) => (
            <li key={i} className="mb-1">
              <strong>{count}</strong> visit{count > 1 ? "s" : ""} at ({latitude.toFixed(5)}, {longitude.toFixed(5)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Map;
