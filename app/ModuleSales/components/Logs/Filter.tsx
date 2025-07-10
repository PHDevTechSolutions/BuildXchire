import React from "react";

interface FilterProps {
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
}

const Filter: React.FC<FilterProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="md:flex-row md:items-center gap-2 mb-4 flex flex-wrap gap-2">
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
