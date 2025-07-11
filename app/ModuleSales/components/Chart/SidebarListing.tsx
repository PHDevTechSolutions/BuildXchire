"use client";

import React, { useState, useMemo } from "react";

interface LocWithDist {
  lat: number;
  lon: number;
  cnt: number;
  name?: string;
  dist: number;
  walkTime: string;
  driveTime: string;
}

interface SidebarListingProps {
  locsWithDist: LocWithDist[];
  flyTo: (lat: number, lon: number) => void;
}

/**
 * Scrollable sidebar list that displays visit count, distance,
 * and ETA for each location. Includes a client‑side search box that filters
 * by name or coordinates in real‑time.
 */
const SidebarListing: React.FC<SidebarListingProps> = ({ locsWithDist, flyTo }) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return locsWithDist;
    const q = query.toLowerCase();
    return locsWithDist.filter(({ name, lat, lon }) => {
      const coords = `${lat.toFixed(5)},${lon.toFixed(5)}`;
      return (
        name?.toLowerCase().includes(q) || coords.includes(q)
      );
    });
  }, [query, locsWithDist]);

  return (
    <div className="md:w-1/3 flex flex-col gap-2 text-xs">
      <h3 className="font-semibold">Location Visit Counts (Distance &amp; ETA)</h3>

      {/* search input */}
      <input
        type="text"
        placeholder="Search by name or coords…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border px-2 py-1 rounded-md shadow-inner focus:outline-none focus:ring focus:ring-blue-300"
      />

      {/* list container */}
      <div className="overflow-auto max-h-96 pr-1">
        <ul className="space-y-1">
          {filtered.length === 0 && <li>No matching locations.</li>}
          {filtered.map(({ lat, lon, cnt, name, dist, walkTime, driveTime }, i) => (
            <li
              key={i}
              className="cursor-pointer hover:text-blue-600 border shadow-md p-2 rounded-md"
              onClick={() => flyTo(lat, lon)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") flyTo(lat, lon);
              }}
            >
              <strong>{cnt}</strong> visit{cnt > 1 ? "s" : ""} • {dist.toFixed(2)} km • 🚶‍♂️ {walkTime} • 🚗 {driveTime} • {name ? `${name} (${lat.toFixed(5)}, ${lon.toFixed(5)})` : `(${lat.toFixed(5)}, ${lon.toFixed(5)})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarListing;
