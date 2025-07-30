import React from "react";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAddClick: () => void;
}

export default function Filters({
  searchTerm,
  setSearchTerm,
  onAddClick,
}: FiltersProps) {
  return (
    <div className="flex items-center justify-between mb-4 text-xs">
      <button
        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={onAddClick}
      >
        Add New Brand
      </button>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded text-xs"
        />
      </div>
    </div>
  );
}
