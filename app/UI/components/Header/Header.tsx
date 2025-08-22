"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { LuMenu, LuCircleX, LuShoppingCart, LuUser, LuMail, LuPhone } from "react-icons/lu";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok } from "react-icons/fa";
import { LuCircleArrowOutDownLeft } from 'react-icons/lu';

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

interface UserDetails {
  UserId: string;
  ReferenceID: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  Role: string;
}

const Header = () => {
  const [styleData, setStyleData] = useState<HeaderStyle | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
    if (!userDetails?.ReferenceID) {
      setCartCount(0); // guest sees 0
      return;
    }

    const refIdParam = `?reference=${encodeURIComponent(userDetails.ReferenceID)}`;
    const res = await fetch(`/api/Backend/Cart/fetch${refIdParam}`);
    const json = await res.json();

    if (json.data && Array.isArray(json.data)) {
      // Filter items where ReferenceID matches exactly
      const filteredItems = json.data.filter(
        (item: any) => item.ReferenceID === userDetails.ReferenceID
      );
      setCartCount(filteredItems.length);
    } else {
      setCartCount(0);
    }
  } catch (err) {
    console.error("Failed to fetch cart count", err);
    setCartCount(0);
  }
};

// Fetch user details if logged in
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

// Refetch cart count whenever userDetails changes
useEffect(() => {
  fetchHeaderStyle("header");
  fetchCartCount();
  const interval = setInterval(fetchCartCount, 5000); // optional polling
  return () => clearInterval(interval);
}, [userDetails]);


  if (!styleData) return null;

  const logoWidth = styleData.LogoSize === "full" ? undefined : parseInt(styleData.LogoSize);
  const containerClass = styleData.ContainerType === "boxed" ? "max-w-[1200px] w-full mx-auto px-4 mt-2" : "w-full px-4";
  const shadowClass = styleData.Shadow || "shadow-md";
  const roundedClass = styleData.BorderRounded ? `rounded-${styleData.BorderRounded}` : "";

  const navLinks = (
    <>
      <Link href={userDetails ? `/UI?id=${userDetails.UserId}` : "/"} className="hover:underline block md:inline">Home</Link>
      <Link href={userDetails ? `/UI/Blog?id=${userDetails.UserId}` : "/UI/Blog"} className="hover:underline block md:inline">Blog</Link>
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

  const handleLogout = () => {
    setUserDetails(null);
    setShowUserMenu(false);
    toast.success("Logged out successfully");
    window.history.replaceState({}, document.title, "/"); // reset URL
  };

  return (
    <header className="py-0 relative z-50">
      <div className="w-full">
        {/* Top Bar */}
        {(styleData.Email || styleData.Phone) && (
          <div className="w-full flex justify-between items-center px-8 py-3 text-xs bg-gray-200 text-black">
            <div className="flex items-center gap-3">
              {socialIcons.map((s, idx) => (
                <a key={idx} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">{s.icon}</a>
              ))}
            </div>
            <div className="flex items-center gap-6">
              {styleData.Email && (
                <div className="flex items-center gap-2">
                  <LuMail size={16} />
                  <a href={`mailto:${styleData.Email}`} className="hover:underline">{styleData.Email}</a>
                </div>
              )}
              {styleData.Phone && (
                <div className="flex items-center gap-2">
                  <LuPhone size={16} />
                  <a href={`tel:${styleData.Phone}`} className="hover:underline">{styleData.Phone}</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Header */}
        <div className={`${containerClass} ${shadowClass} ${roundedClass} flex items-center justify-between py-4 px-8`}
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
            <Link href={userDetails ? `/UI?id=${userDetails.UserId}` : "/"}>
              <div className={styleData.LogoSize === "full" ? "w-full" : "w-auto"} style={{ width: styleData.LogoSize === "full" ? "100%" : `${logoWidth}px` }}>
                <Image src={styleData.Logo} alt="Site Logo" width={logoWidth || 120} height={40} unoptimized style={{ width: styleData.LogoSize === "full" ? "100%" : undefined, height: "auto" }} />
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="flex items-center gap-6">
            <nav className="space-x-4 hidden md:flex">{navLinks}</nav>

            <div className="hidden md:flex items-center gap-4 relative">
              {/* Cart */}
              <Link
                href={userDetails ? `/Products/cart?id=${userDetails.UserId}` : "/Products/cart"}
                className="relative hover:opacity-80"
              >
                <LuShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {userDetails ? (
                <div
                  className="relative flex flex-col items-end"
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <button className="flex items-center gap-2 focus:outline-none">
                    <LuUser size={22} />
                  </button>

                  {showUserMenu && (
                    <div
                      className="absolute top-full mt-2 right-0 w-48 bg-white shadow-lg rounded-lg text-center text-black p-3 flex flex-col gap-2 z-50 transition-all duration-200"
                      style={{ minWidth: "200px" }}
                    >
                      {/* Optional small arrow */}
                      <div className="absolute -top-2 right-4 w-3 h-3 bg-white shadow-md"><LuCircleArrowOutDownLeft /></div>

                      <span className="font-semibold">{`${userDetails.Firstname} ${userDetails.Lastname}`}</span>
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/UserLogin/Login"
                  className="flex items-center gap-2 hover:opacity-80"
                >
                  <LuUser size={22} />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}><LuMenu size={22} /></button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col justify-between z-50" style={{ fontFamily: styleData.FontText, fontSize: styleData.FontSize, color: styleData.FontColor }}>
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)}><LuCircleX size={22} /></button>
              </div>
              <nav className="flex flex-col space-y-4">
                <Link href={userDetails ? `/UI?id=${userDetails.UserId}` : "/"} className="hover:underline">Home</Link>
                <Link href={userDetails ? `/UI/Blog?id=${userDetails.UserId}` : "/UI/Blog"} className="hover:underline">Blog</Link>
              </nav>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <Link href={userDetails ? `/Products/cart?id=${userDetails.UserId}` : "/Products/cart"} className="w-full bg-gray-800 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition relative">
                <LuShoppingCart size={20} /> Cart
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">{cartCount}</span>
                )}
              </Link>
              {userDetails ? (
                <div className="relative">
                  <button onClick={handleLogout} className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-500 transition">
                    <LuUser size={20} /> Logout
                  </button>
                </div>
              ) : (
                <Link href="/UserLogin/Login" className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-500 transition">
                  <LuUser size={20} /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </header>
  );
};

export default Header;
