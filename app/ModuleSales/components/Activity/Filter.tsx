import React from "react";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
}

const Filter: React.FC<FilterProps> = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="md:flex-row md:items-center gap-2 mb-4 flex flex-wrap gap-2">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by Type or Status"
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Filter by Type */}
      <select
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="HR Attendance">HR Attendance</option>
        <option value="On Field">On Field</option>
        <option value="Site Visit">Site Visit</option>
        <option value="On Site">On Site</option>
      </select>

      {/* Date range filter */}
      <label className="text-xs">
        From:{" "}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow"
        />
      </label>
      <label className="text-xs">
        To:{" "}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow"
        />
      </label>
    </div>
  );
};

export default Filter;
