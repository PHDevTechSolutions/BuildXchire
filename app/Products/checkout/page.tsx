"use client";

import React, { useEffect, useState } from "react";
import Header from "../../UI/components/Header/Header";
import Footer from "../../UI/components/Footer/Footer";
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
        toast.success("Checkout successful!");
        setCartItems([]);
        setOrderData(json); // save order info
        setOrderSuccess(true);
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
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-6">Thank you for your order!</h1>
          <p className="mb-4">
            We have received your order, {orderData.FullName}. A confirmation has been sent to{" "}
            <strong>{orderData.Email}</strong>.
          </p>

          <div className="border p-6 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {orderData?.CartItems?.map((item: CartItem, idx: number) => (
              <div
                key={idx}
                className="flex justify-between items-center gap-4 border-b pb-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.ProductImage || "/no-image.png"}
                    alt={item.ProductName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.ProductName}</p>
                    <p className="text-gray-500">SKU: {item.ProductSKU}</p>
                  </div>
                </div>
                <p className="font-semibold">
                  ₱{((item.ProductPrice || 0) * (item.Quantity || 0)).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total:</span>
              <span>₱{(orderData?.TotalAmount ?? 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="border p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <p>
              <strong>Full Name:</strong> {orderData.FullName}
            </p>
            <p>
              <strong>Email:</strong> {orderData.Email}
            </p>
            <p>
              <strong>Phone:</strong> {orderData.Phone}
            </p>
            <p>
              <strong>Address:</strong> {orderData.Address}
            </p>
            <p>
              <strong>Payment Method:</strong> {orderData.PaymentMethod}
            </p>
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
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Info Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 border p-6 rounded shadow"
          >
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <textarea
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="">Select Payment Method</option>
              <option value="For Quote">For Quote</option>
              <option value="Cash">Cash</option>
              <option value="Cards">Cards</option>
            </select>

            <button
              type="submit"
              className="mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-500 transition"
            >
              Place Order
            </button>
          </form>

          {/* Cart Summary */}
          <div className="border p-6 rounded shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center gap-4 border-b pb-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.ProductImage || "/no-image.png"}
                    alt={item.ProductName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.ProductName}</p>
                    <p className="text-gray-500">SKU: {item.ProductSKU}</p>
                  </div>
                </div>
                <p className="font-semibold">
                  ₱{(item.ProductPrice * item.Quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg mt-4">
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
