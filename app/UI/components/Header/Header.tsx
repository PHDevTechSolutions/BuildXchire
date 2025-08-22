"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import {
  LuMenu,
  LuCircleX,
  LuShoppingCart,
  LuUser,
  LuMail,
  LuPhone,
} from "react-icons/lu";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

interface HeaderStyle {
  FontSize: string;
  FontColor: string;
  FontText: string;
  FontStyle: string;
  FontWeight?: string;
  Logo: string;
  LogoSize: string;
  BackgroundColor: string;
  Shadow?: string;
  ContainerType?: string;
  BorderRounded?: string;
  Type?: string;
  Email?: string;
  Phone?: string;
  Facebook?: string;
  Twitter?: string;
  Instagram?: string;
  LinkedIn?: string;
  YouTube?: string;
  TikTok?: string;
}

const Header = () => {
  const [styleData, setStyleData] = useState<HeaderStyle | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch header style
  const fetchHeaderStyle = async (refId: string) => {
    try {
      const res = await fetch(`/api/Backend/HeadFooter/fetch?id=${refId}`);
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        const headerInfo = json.data[0];
        if (headerInfo.Type === "Header") {
          setStyleData({
            FontSize: `${headerInfo.FontSize}px`,
            FontColor: headerInfo.FontColor,
            FontText: headerInfo.FontText,
            FontStyle: headerInfo.FontStyle || "normal",
            FontWeight: headerInfo.FontWeight || "normal",
            Logo: headerInfo.Logo || "/BuildXchire.png",
            LogoSize: headerInfo.LogoSize || "120",
            BackgroundColor: headerInfo.BackgroundColor || "#111827",
            Shadow: headerInfo.Shadow || "shadow-md",
            ContainerType: headerInfo.ContainerType || "boxed",
            BorderRounded: headerInfo.BorderRounded || "md",
            Type: headerInfo.Type,
            Email: headerInfo.Email || "",
            Phone: headerInfo.Phone || "",
            Facebook: headerInfo.Facebook || "",
            Twitter: headerInfo.Twitter || "",
            Instagram: headerInfo.Instagram || "",
            LinkedIn: headerInfo.LinkedIn || "",
            YouTube: headerInfo.YouTube || "",
            TikTok: headerInfo.TikTok || "",
          });
        }
      } else {
        toast.error("No header style data found.");
      }
    } catch {
      toast.error("Failed to fetch header styles.");
    }
  };

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const res = await fetch("/api/Backend/Cart/fetch");
      const json = await res.json();
      if (json.data) {
        setCartCount(json.data.length);
      }
    } catch (err) {
      console.error("Failed to fetch cart count", err);
    }
  };

  // Fetch on mount + polling
  useEffect(() => {
    fetchHeaderStyle("header");
    fetchCartCount();

    const interval = setInterval(() => {
      fetchCartCount();
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!styleData) return null;

  const logoWidth =
    styleData.LogoSize === "full" ? undefined : parseInt(styleData.LogoSize);

  const containerClass =
    styleData.ContainerType === "boxed"
      ? "max-w-[1200px] w-full mx-auto px-4 mt-2"
      : "w-full px-4";

  const shadowClass = styleData.Shadow || "shadow-md";
  const roundedClass = styleData.BorderRounded
    ? `rounded-${styleData.BorderRounded}`
    : "";

  const navLinks = (
    <>
      <Link href="/" className="hover:underline block md:inline">
        Home
      </Link>
      <Link href="../UI/Blog" className="hover:underline block md:inline">
        Blog
      </Link>
    </>
  );

  const socialIcons = [
    { href: styleData.Facebook, icon: <FaFacebook size={18} /> },
    { href: styleData.Twitter, icon: <FaTwitter size={18} /> },
    { href: styleData.Instagram, icon: <FaInstagram size={18} /> },
    { href: styleData.LinkedIn, icon: <FaLinkedin size={18} /> },
    { href: styleData.YouTube, icon: <FaYoutube size={18} /> },
    { href: styleData.TikTok, icon: <FaTiktok size={18} /> },
  ].filter((s) => s.href);

  return (
    <header className="py-0 relative z-50">
      <div className="w-full">
        {/* Top Bar */}
        {(styleData.Email || styleData.Phone) && (
          <div className="w-full flex justify-between items-center px-8 py-3 text-xs bg-gray-200 text-black">
            <div className="flex items-center gap-3">
              {socialIcons.map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-6">
              {styleData.Email && (
                <div className="flex items-center gap-2">
                  <LuMail size={16} />
                  <a href={`mailto:${styleData.Email}`} className="hover:underline">
                    {styleData.Email}
                  </a>
                </div>
              )}
              {styleData.Phone && (
                <div className="flex items-center gap-2">
                  <LuPhone size={16} />
                  <a href={`tel:${styleData.Phone}`} className="hover:underline">
                    {styleData.Phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Header */}
        <div
          className={`${containerClass} ${shadowClass} ${roundedClass} flex items-center justify-between py-4 px-8`}
          style={{
            backgroundColor: styleData.BackgroundColor,
            color: styleData.FontColor,
            fontFamily: styleData.FontText,
            fontSize: styleData.FontSize,
            fontStyle: styleData.FontStyle,
            fontWeight: styleData.FontWeight,
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <div
                className={styleData.LogoSize === "full" ? "w-full" : "w-auto"}
                style={{
                  width: styleData.LogoSize === "full" ? "100%" : `${logoWidth}px`,
                }}
              >
                <Image
                  src={styleData.Logo}
                  alt="Site Logo"
                  width={logoWidth || 120}
                  height={40}
                  unoptimized
                  style={{
                    width: styleData.LogoSize === "full" ? "100%" : undefined,
                    height: "auto",
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="flex items-center gap-6">
            <nav className="space-x-4 hidden md:flex">{navLinks}</nav>
            <div className="hidden md:flex items-center gap-4 relative">
              {/* Cart */}
              <Link href="/Products/cart" className="relative hover:opacity-80">
                <LuShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/UserLogin/Login" className="hover:opacity-80">
                <LuUser size={22} />
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <LuMenu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col justify-between z-50"
            style={{
              fontFamily: styleData.FontText,
              fontSize: styleData.FontSize,
              color: styleData.FontColor,
            }}
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <LuCircleX size={22} />
                </button>
              </div>
              <nav className="flex flex-col space-y-4">{navLinks}</nav>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <Link
                href="/Products/cart"
                className="w-full bg-gray-800 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition relative"
              >
                <LuShoppingCart size={20} />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/login"
                className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-500 transition"
              >
                <LuUser size={20} /> Login
              </Link>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </header>
  );
};

export default Header;
