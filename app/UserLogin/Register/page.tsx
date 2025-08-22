"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../UI/components/Header/Header";
import Footer from "../../UI/components/Footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Role, setRole] = useState("Guest"); // Always Guest
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [ReferenceID, setReferenceID] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate ReferenceID when Firstname or Lastname changes
  useEffect(() => {
    if (Firstname && Lastname) {
      const initials = `${Firstname[0].toUpperCase()}${Lastname[0].toUpperCase()}`;
      // For demo, we use a random number for uniqueness (replace with DB sequence if needed)
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      const formatted = `${initials}-000-${randomNumber.toString().padStart(4, "0")}`;
      setReferenceID(formatted);
    }
  }, [Firstname, Lastname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Email || !Password || !Role || !Firstname || !Lastname) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/Backend/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email, Password, Role, Firstname, Lastname, ReferenceID }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Registration successful!");
        setTimeout(() => router.push("/UserLogin/Login"), 1000);
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-10">
          <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={Firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={Lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
            />
            <input
              type="password"
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              type="hidden"
              placeholder="Role"
              value={Role}
              readOnly
              className="w-full border px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <input
              type="hidden"
              placeholder="Reference ID"
              value={ReferenceID}
              readOnly
              className="w-full border px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/UserLogin/Login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default RegisterPage;
