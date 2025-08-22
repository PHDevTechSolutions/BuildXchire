"use client";

import React from "react";
import Image from "next/image";
import { LuShare2 } from "react-icons/lu";

interface Product {
  ProductSku: string;
  ProductName: string;
  ProductImage: string;
  ProductCategory?: string[];
  ProductPrice: number;
  ProductSalePrice?: number;
  ProductShortDescription?: string;
}

interface RelatedProductsProps {
  relatedProducts: Product[];
  handleProductClick: (sku: string) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ relatedProducts, handleProductClick }) => {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-12">
      <h2 className="text-2xl font-bold mb-2">Related Products</h2>
      <p className="text-gray-600 mb-4">
        Check out these products similar to the one you are viewing. You might find something you love!
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
        {relatedProducts.map((p) => (
          <div
            key={p.ProductSku}
            onClick={() => handleProductClick(p.ProductSku)}
            className="cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-105 hover:shadow-2xl transition"
          >
            {/* Product Image */}
            <div className="relative w-full h-48">
              <Image
                src={p.ProductImage}
                alt={p.ProductName}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
              <button className="absolute top-2 right-2 bg-white/80 p-1 rounded-full">
                <LuShare2 />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-bold text-sm line-clamp-2">{p.ProductName}</h3>

              {/* Categories / Tags */}
              {p.ProductCategory?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.ProductCategory.map((cat, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="mt-2 flex items-center gap-2">
                {p.ProductSalePrice ? (
                  <>
                    <span className="line-through text-red-500 text-xs">
                      ₱{Number(p.ProductPrice).toFixed(2)}
                    </span>
                    <span className="font-semibold text-green-600 text-sm">
                      ₱{Number(p.ProductSalePrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold text-gray-900 text-sm">
                    ₱{Number(p.ProductPrice).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
