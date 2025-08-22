"use client";

import React, { useEffect, useState } from "react";
import Header from "../../UI/components/Header/Header";
import Footer from "../../UI/components/Footer/Footer";
import { LuCreditCard, LuTruck, LuUser, LuMail, LuPhone } from "react-icons/lu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CartItem {
  _id: string;
  ProductSKU: string;
  ProductName: string;
  ProductImage?: string;
  ProductPrice: number;
  Quantity: number;
}

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  // Customer Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("For Quote");

  // Fetch Cart Items
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/Backend/Cart/fetch");
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.data || []);
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

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.ProductPrice * item.Quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !address || cartItems.length === 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const checkoutData = {
      FullName: fullName,
      Email: email,
      Phone: phone,
      Address: address,
      PaymentMethod: paymentMethod || "For Quote",
      CartItems: cartItems.map((item) => ({
        ProductSKU: item.ProductSKU,
        ProductImage: item.ProductImage,
        ProductName: item.ProductName,
        ProductPrice: item.ProductPrice,
        Quantity: item.Quantity,
      })),
      TotalAmount: totalAmount,
      createdAt: new Date(),
    };

    try {
      const res = await fetch("/api/Backend/Checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      if (res.ok) {
        const json = await res.json();

        // Save order data for thank-you page
        setOrderData(json);
        setOrderSuccess(true);

        // Clear cart in UI
        setCartItems([]);

        // Clear cart in backend
        await fetch("/api/Backend/Cart/clear", { method: "DELETE" });

        toast.success("Checkout successful!");
      } else {
        const json = await res.json();
        toast.error(json.error || "Checkout failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error during checkout.");
    }
  };

  if (loading) return <p>Loading cart...</p>;

  // Thank-you page
  if (orderSuccess && orderData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 text-black">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-green-600">
            Thank you for your order!
          </h1>
          <p className="mb-8 text-center text-gray-700 text-lg">
            We have received your order, <strong>{orderData.FullName}</strong>. A confirmation has
            been sent to <strong>{orderData.Email}</strong>.
          </p>

          {/* Order Summary */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
            <div className="flex flex-col gap-4">
              {orderData?.CartItems?.map((item: CartItem, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center gap-4 border-b pb-2 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.ProductImage || "/no-image.png"}
                      alt={item.ProductName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-semibold">{item.ProductName}</p>
                      <p className="text-gray-500 text-sm">SKU: {item.ProductSKU}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.Quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ₱{((item.ProductPrice || 0) * (item.Quantity || 0)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-lg mt-6 border-t pt-4">
              <span>Total:</span>
              <span>₱{(orderData?.TotalAmount ?? 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Delivery Information</h2>
            <div className="flex flex-col gap-2 text-gray-700">
              <p>
                <span className="font-semibold">Full Name:</span> {orderData.FullName}
              </p>
              <p className="flex items-center gap-2">
                <LuMail /> <span className="font-semibold">Email:</span> {orderData.Email}
              </p>
              <p className="flex items-center gap-2">
                <LuPhone /> <span className="font-semibold">Phone:</span> {orderData.Phone}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {orderData.Address}
              </p>
              <p className="flex items-center gap-2">
                <LuCreditCard /> <span className="font-semibold">Payment Method:</span> {orderData.PaymentMethod}
              </p>
            </div>
          </div>

          {/* Back to Shop Button */}
          <div className="text-center">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-500 transition font-semibold flex items-center justify-center gap-2 mx-auto"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty cart page
  if (cartItems.length === 0)
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-10">
          <p className="text-gray-500">Your cart is empty.</p>
        </main>
        <Footer />
      </div>
    );

  // Checkout form
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid md:grid-cols-2">
          {/* Customer Info Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 border p-6 bg-white text-sm"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LuUser size={22} /> Customer Information
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-b px-3 py-2 rounded focus:ring-2 focus:ring-green-400 focus:outline-none transition capitalize"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b px-3 py-2 rounded focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
            />

            <input
              type="number"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-b px-3 py-2 rounded focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              required
            />
            <textarea
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-b px-3 py-2 rounded focus:ring-2 focus:ring-green-400 focus:outline-none transition capitalize"
              required
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border-b px-3 py-2 rounded focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            >
              <option value="">Select Payment Method</option>
              <option value="For Quote">For Quote</option>
              <option value="Cash">Cash</option>
              <option value="Cards">Cards</option>
            </select>

            <button
              type="submit"
              className="mt-4 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition font-semibold"
            >
              <LuCreditCard size={20} /> Place Order
            </button>
          </form>

          {/* Cart Summary */}
          <div className="border p-6 bg-white flex flex-col gap-4 text-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LuTruck size={22} /> Order Summary
            </h2>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center gap-4 border-b pb-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.ProductImage || "/no-image.png"}
                    alt={item.ProductName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{item.ProductName}</p>
                    <p className="text-gray-500 text-sm">SKU: {item.ProductSKU}</p>
                    <p className="text-gray-700 text-sm">
                      Qty: {item.Quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  ₱{(item.ProductPrice * item.Quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
              <span>Total:</span>
              <span>₱{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
