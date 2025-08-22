"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "../../UI/components/Header/Header";
import Footer from "../../UI/components/Footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!Email || !Password) {
        toast.error("Email and Password are required!");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/Backend/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email, Password }),
        });

        const result = await response.json();
        console.log("Login API response:", result);

        if (response.ok) {
          if (!result.userId) {
            toast.error("No user ID received from server");
            setLoading(false);
            return;
          }

          toast.success("Login successful!");
          setTimeout(() => {
            router.push(`/UI?id=${encodeURIComponent(result.userId)}`);
          }, 1000);
        } else {
          toast.error(result.message || "Login failed!");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred while logging in!");
      } finally {
        setLoading(false);
      }
    },
    [Email, Password, router]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-10">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block mb-1 font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 font-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/UserLogin/Register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Register
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default LoginPage;
