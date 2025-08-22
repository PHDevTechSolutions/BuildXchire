"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface FooterStyle {
  FontSize?: string;
  FontColor?: string;
  FontText?: string;
  FontStyle?: string;
  FontWeight?: string;
  Logo?: string;
  LogoSize?: string;
  BackgroundColor?: string;
  Shadow?: string;
  ContainerType?: string;
  BorderRounded?: string;
  Type?: string;
  Address?: string;
}

const Footer: React.FC = () => {
  const [styleData, setStyleData] = useState<FooterStyle | null>(null);

  useEffect(() => {
    const fetchFooterStyle = async () => {
      try {
        const res = await fetch("/api/Backend/HeadFooter/fetch?type=Footer");
        const json = await res.json();

        if (json.data && json.data.length > 0) {
          const footerInfo = json.data[0];
          setStyleData({
            FontSize: `${footerInfo.FontSize}px` || "14px",
            FontColor: footerInfo.FontColor || "#ffffff",
            FontText: footerInfo.FontText || "Arial, sans-serif",
            FontStyle: footerInfo.FontStyle || "normal",
            FontWeight: footerInfo.FontWeight || "normal",
            Logo: footerInfo.Logo || "/BuildXchire.png",
            LogoSize: footerInfo.LogoSize || "120",
            BackgroundColor: footerInfo.BackgroundColor || "#111827",
            Shadow: footerInfo.Shadow || "shadow-md",
            ContainerType: footerInfo.ContainerType || "boxed",
            BorderRounded: footerInfo.BorderRounded || "md",
            Type: footerInfo.Type,
            Address: footerInfo.Address || "Your company address here",
          });
        }
      } catch (err) {
        console.error("Failed to fetch footer:", err);
      }
    };

    fetchFooterStyle();
  }, []);

  const data = styleData || {
    Logo: "/BuildXchire.png",
    Address: "",
    BackgroundColor: "",
    FontColor: "#ffffff",
    FontSize: "14px",
    FontText: "Arial, sans-serif",
    FontStyle: "normal",
    FontWeight: "normal",
    LogoSize: "120",
    ContainerType: "boxed",
    BorderRounded: "md",
    Shadow: "shadow-md",
  };

  const logoWidth =
    data.LogoSize === "full" ? undefined : parseInt(data.LogoSize || "120");

  const containerClass =
    data.ContainerType === "boxed"
      ? "max-w-[1200px] w-full mx-auto px-4"
      : "w-full px-4";

  const shadowClass = data.Shadow || "shadow-md";
  const roundedClass = data.BorderRounded ? `rounded-${data.BorderRounded}` : "";

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <div
        className={`${containerClass} ${shadowClass} ${roundedClass} flex flex-col items-center py-6`}
        style={{
          backgroundColor: data.BackgroundColor,
          color: data.FontColor,
          fontFamily: data.FontText,
          fontSize: data.FontSize,
          fontStyle: data.FontStyle,
          fontWeight: data.FontWeight,
        }}
      >
        {/* Logo on top */}
        <div className="mb-2">
          <Image
            src={data.Logo || "/BuildXchire.png"}
            alt="Logo"
            width={logoWidth || 120}
            height={40}
            unoptimized
            style={{
              width: data.LogoSize === "full" ? "100%" : undefined,
              height: "auto",
            }}
          />
        </div>

        {/* Address */}
        <div className="text-center mb-2">
          <p>{data.Address}</p>
        </div>

        {/* Powered by */}
        <div className="text-center text-xs text-gray-400">
          <p>
            &copy; {currentYear} Powered by{" "}
            <a
              href="https://phdev-tech-solutions.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-600 hover:underline"
            >
              PHDev-Tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
