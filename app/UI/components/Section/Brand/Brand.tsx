"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface BrandType {
  _id: string;
  BrandName: string;
  Thumbnail?: string;
}

const Brand: React.FC = () => {
  const router = useRouter();
  const [brands, setBrands] = useState<BrandType[]>([]);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/Backend/Brand/fetch?id=all");
        const json = await res.json();
        setBrands(json.data || []);
      } catch (err) {
        toast.error("Failed to fetch brands.");
      }
    };

    fetchBrands();
  }, []);

  if (brands.length === 0) {
    return <p className="text-gray-500">No brands found.</p>;
  }

  const isCarousel = brands.length > 6;

  const handleBrandClick = (brandName: string) => {
    router.push(`/Products/brand?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Brands</h2>

      {isCarousel ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="bg-white p-2 rounded-lg shadow flex-shrink-0 cursor-pointer flex flex-col items-center"
              style={{ minWidth: "120px" }}
              onClick={() => handleBrandClick(brand.BrandName)}
            >
              {brand.Thumbnail ? (
                <Image
                  src={brand.Thumbnail}
                  alt={brand.BrandName}
                  width={80}
                  height={40}
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              ) : (
                <div className="w-20 h-10 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-xs text-gray-500">No Image Found</span>
                </div>
              )}
              <div className="mt-2 text-center text-sm font-medium text-gray-700">
                {brand.BrandName}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="bg-white p-2 rounded-lg shadow cursor-pointer flex flex-col items-center"
              onClick={() => handleBrandClick(brand.BrandName)}
            >
              {brand.Thumbnail ? (
                <Image
                  src={brand.Thumbnail}
                  alt={brand.BrandName}
                  width={80}
                  height={40}
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              ) : (
                <div className="w-20 h-10 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-xs text-gray-500">No Image Found</span>
                </div>
              )}
              <div className="mt-2 text-center text-sm font-medium text-gray-700">
                {brand.BrandName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Brand;
