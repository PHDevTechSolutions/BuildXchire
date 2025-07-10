"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!Email || !Password) {
        toast.error("Email and Password are required!");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/login", {
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
            router.push(`/ModuleSales/Sales/Dashboard?id=${encodeURIComponent(result.userId)}`);
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
    <div className="flex min-h-screen items-center justify-center bg-gray-900 relative p-4">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/building.jpg')" }}></div>
      <ToastContainer className="text-xs" />
      <div className="relative z-10 w-full max-w-md p-8 bg-white backdrop-blur-lg rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm text-xs focus:ring-green-700"
          />
          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm text-xs focus:ring-green-700"
          />
          <button
            type="submit"
            className="w-full py-3 bg-green-800 text-white text-xs font-medium rounded-md hover:bg-green-600 shadow-md"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-xs text-center font-bold">Enterprise Resource Planning - Developed By IT Department</p>
      </div>
    </div>
  );
};

export default Login;
