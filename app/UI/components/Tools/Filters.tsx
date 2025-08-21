"use client";

import React from "react";
import { LuSearch, LuFilter, LuArrowUp, LuArrowDown, LuLayoutGrid, LuLayoutList } from "react-icons/lu";

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  filterTag: string;
  setFilterTag: (value: string) => void;
  tags: string[];
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  viewMode: "grid" | "table";
  setViewMode: (value: "grid" | "table") => void;
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}

const Filters: React.FC<FiltersProps> = ({
  search,
  setSearch,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  showSidebar,
  setShowSidebar,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 text-sm">
      {/* Left side: Filter + Search */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="flex items-center gap-1 border px-3 py-2 rounded bg-white hover:bg-gray-100 w-full sm:w-auto justify-center"
        >
          <LuFilter />
          Filter
        </button>

        <div className="relative w-full md:w-64">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border pl-10 pr-3 py-2 rounded w-full"
          />
        </div>
      </div>

      {/* Right side: Sort + View Toggle */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        <div className="relative w-full sm:w-64 md:w-48">
          {sortOrder === "asc" ? (
            <LuArrowUp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          ) : (
            <LuArrowDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          )}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border pl-10 pr-3 py-2 rounded w-full"
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        <button
          onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
          className="flex items-center gap-1 border px-3 py-2 rounded w-full sm:w-auto justify-center"
        >
          {viewMode === "grid" ? <LuLayoutList /> : <LuLayoutGrid />}
          {viewMode === "grid" ? "Table" : "Grid"}
        </button>
      </div>
    </div>
  );
};

export default Filters;
