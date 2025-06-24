'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiDark, CiSun } from 'react-icons/ci';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { motion } from 'framer-motion';

type LoadingPageProps = {
  userId: string;
  department: string;
};

const LoadingPage: React.FC<LoadingPageProps> = ({ userId, department }) => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(console.error);
    }

    const duration = 10000;
    const intervalTime = 50;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      const percentage = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(percentage);

      if (percentage >= 100) {
        clearInterval(interval);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        router.push(`/Module${department}/${department}/Dashboard?id=${encodeURIComponent(userId)}`);
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [router, userId, department]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white text-white font-sans">
      {/* Hidden audio element controlled by ref */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00ffcc33_1px,transparent_1px)] bg-[size:40px_40px] z-0" />

      <audio ref={audioRef} src="/binary-logout-sfx.mp3" preload="auto" />

      <svg width={120} height={120} className="mb-4">
        <circle
          stroke="#0ff"
          fill="transparent"
          strokeWidth={8}
          r={radius}
          cx={60}
          cy={60}
          style={{ opacity: 0.2 }}
        />
        <motion.circle
          stroke="#0ff"
          fill="transparent"
          strokeWidth={8}
          r={radius}
          cx={60}
          cy={60}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      </svg>
      <p className="text-md tracking-wide">Loading Taskflow {progress}%</p>
    </div>
  );
};

const Login: React.FC = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockUntil, setLockUntil] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showPassword, setShowPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const router = useRouter();
  const isDark = theme === 'dark';

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!Email || !Password || !Department) {
        toast.error('All fields are required!');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Email, Password, Department }),
        });

        const result = await response.json();

        if (!response.ok) {
          if (result.lockUntil) {
            setLockUntil(new Date(result.lockUntil).toLocaleString());
            toast.error(`Account locked! Try again after ${new Date(result.lockUntil).toLocaleString()}.`);
          } else {
            toast.error(result.message || 'Login failed!');
          }
          return;
        }

        if (result.Department !== Department) {
          toast.error('Department mismatch!');
          return;
        }

        toast.success('Login successful!');
        setLoggedInUserId(result.userId);
        setShowLoading(true);
      } catch (error) {
        console.error('Login error:', error);
        toast.error('An error occurred while logging in!');
      } finally {
        setLoading(false);
      }
    },
    [Email, Password, Department]
  );

  const handleSignUp = () => {
    router.push('/Register');
  };

  if (showLoading && loggedInUserId) {
    return <LoadingPage userId={loggedInUserId} department={Department} />;
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"
        }`}
    >
      <ToastContainer
        className="text-xs"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        transition={Slide}
      />

      {/* Background Grid Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00ffcc33_1px,transparent_1px)] bg-[size:40px_40px] z-0" />

      {/* Toggle Button */}
      <div className="absolute top-5 right-5 z-20">
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.9 }}
          className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? 'bg-yellow-400' : 'bg-gray-800'
            } text-white shadow-md transition-colors duration-300`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        >
          {isDark ? <CiSun className="w-5 h-5 text-black" /> : <CiDark className="w-5 h-5 text-white" />}
        </motion.button>
      </div>

      {/* Login Card with tilt and entrance animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`bg-white dark:bg-black/10 p-6 rounded-xl shadow-lg w-full max-w-md`}
      >
        <div className="flex flex-col items-center mb-6 text-center">
          <Image src="/fluxx-tech-solutions-logo.png" alt="Fluxx-Tech Solutions" width={200} height={100} className="mb-4 rounded-md" />
          <p className="text-xs mt-2 max-w-sm text-black">
            Streamline operations, manage data intelligently, and experience the future of business management
            with our ERP platform.
          </p>
        </div>

        {lockUntil && (
          <p className="text-red-500 text-xs font-semibold text-center mb-4">
            Account locked! Try again after: {lockUntil}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative text-black">
          <div>
            <label className="text-xs block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="e.g. user@example.com"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border-b text-xs text-black"
            />
          </div>

          <div className="relative">
            <label className="text-xs block mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Your secure password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border-b text-xs text-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
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
              className="w-full p-2 border-b text-xs text-black"
            >
              <option value="">Select Department</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 hover:scale-[1.02] text-white font-semibold text-xs rounded-lg transition-all duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >{loading ? 'Signing In...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={handleSignUp}
            className="w-full py-2 text-cyan-400 hover:text-black text-xs underline transition duration-200"
          >
            Don't have an account? Sign Up
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;