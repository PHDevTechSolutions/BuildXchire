"use client";

import React, { useState, useEffect } from "react";
import { LuShoppingCart } from "react-icons/lu";
import { toast } from "react-toastify";

interface RightColumnProps {
  product: any;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

interface UserDetails {
  UserId: string;
  ReferenceID: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  Role: string;
}

const RightColumn: React.FC<RightColumnProps> = ({
  product,
  quantity,
  setQuantity,
}) => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  // Fetch user details to get ReferenceID
  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get("id");
    if (!userId) return;

    (async () => {
      try {
        const res = await fetch(`/api/Backend/user?id=${encodeURIComponent(userId)}`);
        const data = await res.json();
        setUserDetails({
          UserId: data._id,
          ReferenceID: data.ReferenceID ?? "",
          Firstname: data.Firstname ?? "",
          Lastname: data.Lastname ?? "",
          Email: data.Email ?? "",
          Role: data.Role ?? "",
        });
      } catch (err) {
        toast.error("Failed to fetch user data.");
      }
    })();
  }, []);

  const handleAddToCart = async () => {
    if (!userDetails) {
      toast.error("User not loaded yet.");
      return;
    }

    setLoading(true);

    const cartItem = {
      CartNumber: "CART-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      ProductName: product.ProductName,
      ProductSKU: product.ProductSku,
      ProductImage: product.ProductImage || "",
      ProductPrice: Number(product.ProductSalePrice || product.ProductPrice) * quantity,
      Quantity: quantity,
      ReferenceID: userDetails.ReferenceID, // <-- ReferenceID passed here
    };

    try {
      const res = await fetch("/api/Backend/Cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });

      if (res.ok) toast.success("Product added to cart!", { autoClose: 2000 });
      else toast.error("Failed to add to cart.", { autoClose: 2000 });
    } catch (err) {
      toast.error("Error adding to cart.", { autoClose: 2000 });
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

        <button
          onClick={handleAddToCart}
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
