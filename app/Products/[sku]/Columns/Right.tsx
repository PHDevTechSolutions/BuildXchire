"use client";

import React from "react";
import { LuShoppingCart } from "react-icons/lu";
import { QRCodeCanvas } from "qrcode.react";

interface RightColumnProps {
  product: any;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  handleSubmit: () => void;
  qrValue: string;
  handleQrAddToCart: () => void;
}

const RightColumn: React.FC<RightColumnProps> = ({
  product,
  quantity,
  setQuantity,
  handleSubmit,
  qrValue,
  handleQrAddToCart,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* SKU */}
      <p className="text-sm text-gray-500 mt-10">SKU: {product.ProductSku}</p>

      {/* Product Name */}
      <h1 className="text-3xl font-bold">{product.ProductName}</h1>

      {/* Price */}
      <div className="flex gap-4 items-center mt-2">
        <span className="font-semibold text-lg text-gray-900">
          ₱{Number(product.ProductPrice).toFixed(2)}
        </span>
        {product.ProductSalePrice && (
          <span className="text-green-600 font-semibold">
            ₱{Number(product.ProductSalePrice).toFixed(2)}
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
      <div className="flex gap-4 mt-4">
        <div className="flex items-center border rounded">
          <button
            className="px-3 py-2 text-gray-700 hover:bg-gray-200"
            onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
          >
            -
          </button>
          <span className="px-4">{quantity}</span>
          <button
            className="px-3 py-2 text-gray-700 hover:bg-gray-200"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 transition"
        >
          <LuShoppingCart size={20} /> Add to Cart
        </button>
      </div>

      {/* QR Code Section */}
      <div className="mt-6 flex justify-start">
        <QRCodeCanvas
          value={qrValue}
          size={150}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
          onClick={handleQrAddToCart} // click for testing
        />
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
            {product.ProductDescription
              ? product.ProductDescription.replace(/<\/?[^>]+(>|$)/g, "")
              : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default RightColumn;
