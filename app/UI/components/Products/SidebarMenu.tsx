"use client";

import React, { useState } from "react";

interface SidebarMenuProps {
  tags: string[];
  filterTag: string;
  setFilterTag: (tag: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  setShowSidebar: (show: boolean) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  tags,
  filterTag,
  setFilterTag,
  priceRange,
  setPriceRange,
  maxPrice,
  handlePriceChange,
  setShowSidebar,
}) => {
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  return (
    <>
      {/* Mobile floating sidebar */}
      <div className="md:hidden">
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowSidebar(false)}
        />
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-4 overflow-y-auto transition-transform duration-300">
          
          {/* Categories Section */}
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              <h3 className="font-semibold">Categories</h3>
              <span>{categoriesOpen ? "−" : "+"}</span>
            </div>
            {categoriesOpen && (
              <ul className="flex flex-col gap-2">
                <li
                  className={`cursor-pointer px-3 py-1 rounded hover:bg-gray-100 ${
                    filterTag === "All" ? "bg-gray-200 font-semibold" : ""
                  }`}
                  onClick={() => {
                    setFilterTag("All");
                    setShowSidebar(false);
                  }}
                >
                  All
                </li>
                {tags
                  .filter((tag) => tag !== "All")
                  .map((tag, idx) => (
                    <li
                      key={`tag-mobile-${idx}`}
                      className={`cursor-pointer px-3 py-1 rounded hover:bg-gray-100 ${
                        filterTag === tag ? "bg-gray-200 font-semibold" : ""
                      }`}
                      onClick={() => {
                        setFilterTag(tag);
                        setShowSidebar(false);
                      }}
                    >
                      {tag}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Price Slider Section */}
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => setPriceOpen(!priceOpen)}
            >
              <h4 className="font-semibold">Price Range</h4>
              <span>{priceOpen ? "−" : "+"}</span>
            </div>
            {priceOpen && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    min={0}
                    max={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="border rounded px-2 py-1 w-1/2"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    min={priceRange[0]}
                    max={maxPrice}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="border rounded px-2 py-1 w-1/2"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full mt-2"
                />
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full mt-1"
                />
              </>
            )}
          </div>

          <button
            onClick={() => setShowSidebar(false)}
            className="mt-4 w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>

      {/* Desktop inline sidebar */}
      <div className="hidden md:block w-[30rem] bg-white shadow-lg p-4 overflow-y-auto transition-all duration-300 text-sm">
        
        {/* Categories Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
          >
            <h3 className="font-semibold">Categories</h3>
            <span>{categoriesOpen ? "−" : "+"}</span>
          </div>
          {categoriesOpen && (
            <ul className="flex flex-col gap-2 mb-4">
              <li
                className={`cursor-pointer px-3 py-1 rounded hover:bg-gray-100 ${
                  filterTag === "All" ? "bg-gray-200 font-semibold" : ""
                }`}
                onClick={() => setFilterTag("All")}
              >
                All
              </li>
              {tags
                .filter((tag) => tag !== "All")
                .map((tag, idx) => (
                  <li
                    key={`tag-${idx}`}
                    className={`cursor-pointer px-3 py-1 rounded hover:bg-gray-100 ${
                      filterTag === tag ? "bg-gray-200 font-semibold" : ""
                    }`}
                    onClick={() => setFilterTag(tag)}
                  >
                    {tag}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Price Slider Section */}
        <div>
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => setPriceOpen(!priceOpen)}
          >
            <h4 className="font-semibold">Price Range</h4>
            <span>{priceOpen ? "−" : "+"}</span>
          </div>
          {priceOpen && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  min={0}
                  max={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="border rounded px-2 py-1 w-1/2"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  min={priceRange[0]}
                  max={maxPrice}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="border rounded px-2 py-1 w-1/2"
                />
              </div>
              <input
                type="range"
                min={0}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                className="w-full mt-2"
              />
              <input
                type="range"
                min={0}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                className="w-full mt-1"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
