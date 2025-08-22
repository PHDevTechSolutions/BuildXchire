"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaViber } from "react-icons/fa";
import { BsX } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface LeftColumnProps {
  product: {
    ProductName: string;
    ProductImage: string;
    ProductGallery?: string[];
    ProductCategory?: string[]; // <-- multiple categories
    ProductSku: string;
  };
  mainImage: string;
  setMainImage: (img: string) => void;
  gallery: string[];
  galleryStart: number;
  visibleThumbnails: number;
  scrollLeft: () => void;
  scrollRight: () => void;
}

const LeftColumn: React.FC<LeftColumnProps> = ({
  product,
  mainImage,
  setMainImage,
  gallery,
  galleryStart,
  visibleThumbnails,
  scrollLeft,
  scrollRight,
}) => {
  const router = useRouter();
  const [zoom, setZoom] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCursorPos({ x, y });
  };

  const shareUrl = `${window.location.origin}/Products/${product.ProductSku}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("URL copied to clipboard!");
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4 relative">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-2 flex flex-wrap gap-1">
        <span className="cursor-pointer hover:underline" onClick={() => router.push("/")}>
          Home
        </span>
        {product.ProductCategory && product.ProductCategory.length > 0 &&
          product.ProductCategory.map((cat, idx) => (
            <React.Fragment key={idx}>
              /{" "}
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push(`/Products/category?category=${cat}`)}
              >
                {cat}
              </span>
            </React.Fragment>
          ))
        }
        / <span className="font-semibold text-gray-800">{product.ProductName}</span>
      </nav>

      {/* Main Image */}
      <div
        className="relative w-full aspect-[4/5] md:aspect-[3/4] rounded-lg overflow-hidden"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={mainImage}
          alt={product.ProductName}
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />

        {/* Magnifier */}
        {zoom && (
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              backgroundImage: `url(${mainImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "200%",
              backgroundPosition: `${cursorPos.x}% ${cursorPos.y}%`,
            }}
          />
        )}
      </div>

      {/* Share Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          <FaFacebookF size={18} />
        </button>
        <button
          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(product.ProductName)}`, "_blank")}
          className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
        >
          <FaTwitter size={18} />
        </button>
        <button
          onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(product.ProductName)}`, "_blank")}
          className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800"
        >
          <FaLinkedinIn size={18} />
        </button>
        <button
          onClick={() => window.open(`viber://forward?text=${encodeURIComponent(product.ProductName + " " + shareUrl)}`, "_blank")}
          className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
        >
          <FaViber size={18} />
        </button>
        <button
          onClick={() => window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, "_blank")}
          className="p-2 bg-black text-white rounded-full hover:bg-gray-800"
        >
          <BsX size={18} />
        </button>
        <button
          onClick={handleCopyUrl}
          className="p-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400"
        >
          <FiCopy size={18} />
        </button>
      </div>
    </div>
  );
};

export default LeftColumn;
