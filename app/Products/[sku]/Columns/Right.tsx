"use client";

import React, { useState } from "react";
import { LuShoppingCart } from "react-icons/lu";

interface RightColumnProps {
  product: any;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  handleSubmit: () => Promise<void>; // assume handleSubmit is async
}

const RightColumn: React.FC<RightColumnProps> = ({
  product,
  quantity,
  setQuantity,
  handleSubmit,
}) => {
  const [loading, setLoading] = useState(false);

  const onAddToCart = async () => {
    setLoading(true);
    try {
      await handleSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* SKU */}
      <p className="text-sm text-gray-500 mt-10">SKU: {product.ProductSku}</p>

      {/* Product Name */}
      <h1 className="text-3xl font-bold">{product.ProductName}</h1>

      {/* Price */}
      <div className="flex gap-4 items-center mt-2">
        {product.ProductSalePrice ? (
          <>
            <span className="text-red-600 text-sm font-semibold line-through">
              ₱{Number(product.ProductPrice).toFixed(2)}
            </span>
            <span className="text-green-600 font-semibold">
              ₱{Number(product.ProductSalePrice).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-green-600 font-semibold">
            ₱{Number(product.ProductPrice).toFixed(2)}
          </span>
        )}
      </div>

      {/* Short Description */}
      <p className="text-gray-700">
        {product.ProductShortDescription
          ? product.ProductShortDescription.replace(/<\/?[^>]+(>|$)/g, "")
          : "No short description available."}
      </p>

      {/* Quantity + Add to Cart */}
      <div className="flex gap-4 mt-4 items-center">
        {/* Enhanced Quantity Selector */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-bold"
            onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
          >
            -
          </button>
          <span className="px-6 py-2 text-center font-medium bg-white">{quantity}</span>
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-bold"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </button>
        </div>

        {/* Add to Cart Button with Loading */}
        <button
          onClick={onAddToCart}
          disabled={loading}
          className={`flex items-center gap-2 py-3 px-6 rounded-lg transition ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          <LuShoppingCart size={20} />
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>

      {/* Brand and Full Description */}
      <div className="mt-6 flex flex-col gap-2">
        {product.ProductBrand && (
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Brand:</span> {product.ProductBrand}
          </p>
        )}
        {product.ProductDescription && (
          <p className="text-gray-700">
            {product.ProductDescription.replace(/<\/?[^>]+(>|$)/g, "")}
          </p>
        )}
      </div>
    </div>
  );
};

export default RightColumn;
