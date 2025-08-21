"use client";

import React from "react";
import Image from "next/image";

interface PreviewProps {
  postData: any;
}

const Preview: React.FC<PreviewProps> = ({ postData }) => {
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

  return (
    <div className="col-span-2 space-y-4 border p-4 rounded shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700">
        Live Footer Preview
      </h2>

      <footer
        className={`${containerClass} ${shadowClass} ${roundedClass} py-6 flex flex-col items-center gap-4 text-center`}
        style={{
          backgroundColor,
          color: fontColor,
          fontFamily,
          fontSize,
          fontStyle,
          fontWeight,
        }}
      >
        {/* 🔹 Logo (Top Row) */}
        <div
          className={logoSize === "full" ? "w-full" : "w-auto"}
          style={{
            width: logoSize === "full" ? "100%" : `${logoWidth}px`,
          }}
        >
          <Image
            src={logoSrc}
            alt="Logo"
            width={logoWidth || 120}
            height={40}
            unoptimized
            style={{
              width: logoSize === "full" ? "100%" : undefined,
              height: "auto",
            }}
          />
        </div>

        {/* 🔹 Address (Bottom Row) */}
        {postData.Address && (
          <p className="text-sm max-w-md">{postData.Address}</p>
        )}
      </footer>
    </div>
  );
};

export default Preview;
