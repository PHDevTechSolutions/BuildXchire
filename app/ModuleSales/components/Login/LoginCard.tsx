'use client';

import React from 'react';
// Icons
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { FcGoogle } from "react-icons/fc";
// Motion
import { motion } from 'framer-motion';
// Route Image
import Image from 'next/image';
// Toast Notifications
import { toast } from 'react-toastify';

interface LoginCardProps {
  Email: string;
  setEmail: (val: string) => void;
  Password: string;
  setPassword: (val: string) => void;
  Department: string;
  setDepartment: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  lockUntil: string | null;
  isDark: boolean;
}

const LoginCard: React.FC<LoginCardProps> = ({
  Email, setEmail,
  Password, setPassword,
  Department, setDepartment,
  showPassword, setShowPassword,
  loading,
  handleSubmit,
  lockUntil,
  isDark
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`p-10 backdrop-blur-xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-black/10 border-black/20'
        } border rounded-2xl shadow-2xl`}
    >
      <div className="flex flex-col items-center mb-6 text-center">
        <Image src="/taskflow-full.png" alt="Ecoshift Corporation" width={200} height={100} className="mb-4" />
        <p className="text-xs mt-2 max-w-sm">
          Streamline operations, manage data intelligently, and experience the future of business management
          with our ERP platform.
        </p>
      </div>

      {lockUntil && (
        <p className="text-red-500 text-xs font-semibold text-center mb-4">
          Account locked! Try again after: {lockUntil}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 relative">
        <div>
          <label className="text-xs block mb-1">Email Address</label>
          <input
            type="email"
            placeholder="e.g. user@example.com"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 bg-transparent border ${isDark ? 'border-white/30 text-white' : 'border-black/30 text-black'
              } text-xs rounded-md backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none transition duration-300 ease-in-out transform focus:scale-[1.01]`}
          />
        </div>

        <div className="relative">
          <label className="text-xs block mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Your secure password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 bg-transparent border ${isDark ? 'border-white/30 text-white' : 'border-black/30 text-black'
              } text-xs rounded-md backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none transition duration-300 ease-in-out transform focus:scale-[1.01]`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-cyan-400 hover:text-cyan-600 transition duration-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <VscEyeClosed className="w-5 h-5" /> : <VscEye className="w-5 h-5" />}
          </button>
        </div>

        <div>
          <label className="text-xs block mb-1">Department</label>
          <select
            value={Department}
            onChange={(e) => setDepartment(e.target.value)}
            className={`w-full px-4 py-2 bg-white border ${isDark ? 'border-white/30 text-black' : 'border-black/30 text-black'
              } text-xs rounded-md backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none transition duration-300 ease-in-out transform focus:scale-[1.01]`}
          >
            <option value="">Select Department</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 hover:scale-[1.02] text-white font-semibold text-xs rounded-lg transition-all duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => toast.info("Google sign-up clicked. (Integrate OAuth here)")}
          className="w-full py-3 flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 hover:scale-[1.02] font-semibold text-xs rounded-lg transition-all duration-300 shadow-md"
        >
          <FcGoogle size={20} />
          Sign up with Google
        </button>
      </div>

      <p className="mt-6 text-center text-xs font-light tracking-wider">
        Taskflow | PH-Devtech Solutions
      </p>
    </motion.div>
  );
};

export default LoginCard;
