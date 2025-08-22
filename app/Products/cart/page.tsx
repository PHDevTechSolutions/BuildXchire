"use client";

import React, { useEffect, useState } from "react";
import Header from "../../UI/components/Header/Header";
import Footer from "../../UI/components/Footer/Footer";
import { LuTrash2, LuShoppingCart, LuArrowLeft, LuRefreshCw } from "react-icons/lu";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CartItem {
  _id: string;
  ProductSKU: string;
  ProductName: string;
  ProductImage: string;
  ProductPrice: number; // price per unit
  Quantity: number;
  unitPrice: number; // store original unit price
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Cart Items
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/Backend/Cart/fetch");
      const data = await res.json();
      if (res.ok) {
        // store unitPrice separately to calculate total later
        const itemsWithUnitPrice = data.data.map((item: any) => ({
          ...item,
          unitPrice: item.ProductPrice / item.Quantity,
        }));
        setCartItems(itemsWithUnitPrice);
      } else {
        toast.error(data.error || "Failed to fetch cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Update Quantity on server
  const handleUpdateItem = async (item: CartItem) => {
    try {
      const totalPrice = item.unitPrice * item.Quantity;
      const res = await fetch("/api/Backend/Cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item._id,
          quantity: item.Quantity,
          totalPrice,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("Cart updated successfully");
        fetchCartItems();
      } else {
        toast.error(json.error || "Failed to update item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    }
  };

  // Remove Item
  const removeItem = async (id: string) => {
    try {
      const res = await fetch("/api/Backend/Cart/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Item removed");
        setCartItems(prev => prev.filter(item => item._id !== id));
      } else {
        toast.error(data.error || "Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // Adjust local quantity only
  const adjustQuantity = (itemId: string, change: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === itemId
          ? {
            ...item,
            Quantity: Math.max(item.Quantity + change, 1),
            ProductPrice:
              item.unitPrice * Math.max(item.Quantity + change, 1),
          }
          : item
      )
    );
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.ProductPrice, 0);

  if (loading) return <p>Loading cart...</p>;

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-4 border p-4 rounded-lg shadow hover:shadow-md transition"
              >
                {/* Product Image */}
                <img
                  src={item.ProductImage}
                  alt={item.ProductName}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* Product Info */}
                <div className="flex-1 flex flex-col gap-1">
                  <p className="font-semibold text-lg">{item.ProductName}</p>
                  <p className="text-gray-500 text-sm">SKU: {item.ProductSKU}</p>
                  <p className="text-gray-700 font-semibold">
                    ₱{item.ProductPrice.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustQuantity(item._id, -1)}
                    disabled={item.Quantity <= 1}
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="px-2 font-medium">{item.Quantity}</span>
                  <button
                    onClick={() => adjustQuantity(item._id, 1)}
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                {/* Remove Item */}
                <div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-600 transition"
                    title="Remove Item"
                  >
                    <LuTrash2 size={24} />
                  </button>
                </div>
              </div>
            ))}

            {/* Bottom Buttons Row */}
            <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
              {/* Left Side: Return to Shop + Update All */}
              <div className="flex gap-3">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded transition"
                >
                  <LuArrowLeft size={18} /> Return to Shop
                </button>
                <button
                  onClick={() => cartItems.forEach((item) => handleUpdateItem(item))}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                >
                  <LuRefreshCw size={18} /> Update
                </button>
              </div>

              {/* Right Side: Check Out */}
              <div>
                <button
                  onClick={() => (window.location.href = "./checkout")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
                >
                  <LuShoppingCart size={18} /> Check Out
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end mt-4 font-semibold text-lg">
              Total: ₱{totalAmount.toFixed(2)}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
