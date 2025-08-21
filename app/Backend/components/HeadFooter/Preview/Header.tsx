"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    LuMail,
    LuPhone,
    LuShoppingCart,
    LuUser,
    LuMenu,
    LuCircleX,
} from "react-icons/lu";
import {
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaYoutube,
    FaInstagram,
    FaTiktok,
} from "react-icons/fa";
interface PreviewProps {
    postData: any;
}

const Preview: React.FC<PreviewProps> = ({ postData }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const fontSize = postData.FontSize ? `${postData.FontSize}px` : "16px";
    const fontColor = postData.FontColor || "#000000";
    const fontFamily = postData.FontText || "inherit";
    const fontStyle = postData.FontStyle || "normal";
    const fontWeight = postData.FontWeight || "normal";
    const backgroundColor = postData.BackgroundColor || "#ffffff";
    const logoSrc = postData.Logo || "/BuildXchire.png";
    const logoSize = postData.LogoSize || "120";
    const logoWidth = logoSize === "full" ? undefined : parseInt(logoSize);

    const roundedClass = postData.BorderRounded
        ? `rounded-${postData.BorderRounded}`
        : "";

    const shadowClass = postData.Shadow || "shadow-md";

    const containerClass =
        postData.ContainerType === "boxed"
            ? `max-w-[1200px] mx-auto px-[5%]`
            : `w-full px-4`;

    const socialIcons = [
        { icon: <FaFacebook size={16} />, href: "https://facebook.com" },
        { icon: <FaTwitter size={16} />, href: "https://twitter.com" },
        { icon: <FaLinkedin size={16} />, href: "https://linkedin.com" },
        { icon: <FaYoutube size={16} />, href: "https://youtube.com" },
        { icon: <FaInstagram size={16} />, href: "https://instagram.com" },
        { icon: <FaTiktok size={16} />, href: "https://tiktok.com" },
    ];

    return (
        <div className="col-span-2 space-y-4 border p-4 rounded shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700">
                Live Header Preview
            </h2>

            <header className="py-0 relative z-50">
                <div className="w-full">
                    {/* 🔹 Top Bar: Social + Email + Phone */}
                    {(postData.Email || postData.Phone) && (
                        <div className="w-full flex justify-between items-center gap-6 px-8 py-3 text-xs bg-gray-200 text-black">
                            {/* Social Icons (Left) */}
                            <div className="hidden md:flex items-center gap-3">
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

                            {/* Email + Phone (Right) */}
                            <div className="flex items-center gap-6">
                                {postData.Email && (
                                    <div className="flex items-center gap-2">
                                        <LuMail size={16} />
                                        <a
                                            href={`mailto:${postData.Email}`}
                                            className="hover:underline"
                                        >
                                            {postData.Email}
                                        </a>
                                    </div>
                                )}
                                {postData.Phone && (
                                    <div className="flex items-center gap-2">
                                        <LuPhone size={16} />
                                        <a
                                            href={`tel:${postData.Phone}`}
                                            className="hover:underline"
                                        >
                                            {postData.Phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 🔹 Main Header Row */}
                    <div
                        className={`${containerClass} ${shadowClass} ${roundedClass} flex items-center justify-between py-4 px-8`}
                        style={{
                            backgroundColor,
                            color: fontColor,
                            fontFamily,
                            fontSize,
                            fontStyle,
                            fontWeight,
                        }}
                    >
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div
                                className={logoSize === "full" ? "w-full" : "w-auto"}
                                style={{
                                    width:
                                        logoSize === "full" ? "100%" : `${logoWidth}px`,
                                }}
                            >
                                <Image
                                    src={logoSrc}
                                    alt="Logo"
                                    width={logoWidth || 120}
                                    height={40}
                                    unoptimized
                                    style={{
                                        width:
                                            logoSize === "full" ? "100%" : undefined,
                                        height: "auto",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Navigation + Icons */}
                        <div className="flex items-center gap-6">
                            <nav className="space-x-4 hidden md:flex text-sm">
                                <Link href="/" className="hover:underline">
                                    Home
                                </Link>
                                <Link href="/about" className="hover:underline">
                                    About
                                </Link>
                            </nav>
                            <div className="hidden md:flex items-center gap-4">
                                <Link href="/cart" className="hover:opacity-80">
                                    <LuShoppingCart size={22} />
                                </Link>
                                <Link href="/login" className="hover:opacity-80">
                                    <LuUser size={22} />
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <LuMenu size={22} />
                        </button>
                    </div>
                </div>

                {/* 🔹 Mobile Sidebar */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                        <div
                            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-6 z-50 flex flex-col justify-between"
                            style={{
                                fontFamily,
                                fontSize,
                                color: fontColor,
                            }}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-bold text-lg">Menu</h2>
                                    <button onClick={() => setIsMobileMenuOpen(false)}>
                                        <LuCircleX size={22} />
                                    </button>
                                </div>
                                <nav className="flex flex-col space-y-4">
                                    <Link href="/" className="hover:underline">
                                        Home
                                    </Link>
                                    <Link href="/about" className="hover:underline">
                                        About
                                    </Link>
                                </nav>
                            </div>

                            {/* Bottom Buttons */}
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/cart"
                                    className="bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <LuShoppingCart size={20} /> Cart
                                </Link>
                                <Link
                                    href="/login"
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <LuUser size={20} /> Login
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
};

export default Preview;
