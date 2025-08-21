"use client";

import React from "react";

interface LogoProps {
  postData: any;
  setPostData: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleImageUpload: (file: File, callback: (url: string) => void) => void;
}

const Logo: React.FC<LogoProps> = ({ postData, setPostData, handleChange, handleImageUpload }) => {
  return (
    <>
      {/* Logo Image */}
      <div>
        <label className="block text-gray-400 mb-1">Logo Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageUpload(file, (url) =>
                setPostData((prev: any) => ({ ...prev, Logo: url }))
              );
            }
          }}
          className="border rounded p-2 text-xs w-full"
        />
        {postData.Logo?.trim() && (
          <div className="mt-2 flex items-center gap-4">
            <img
              src={postData.Logo}
              alt="Logo Preview"
              className="w-24 h-24 object-cover border rounded"
            />
            <button
              type="button"
              onClick={() =>
                setPostData((prev: any) => ({ ...prev, Logo: "" }))
              }
              className="text-red-500 text-xs underline hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Logo Size */}
      <div>
        <label className="block text-gray-400 mb-1">Logo Size</label>
        <select
          name="LogoSize"
          value={postData.LogoSize || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Select logo size</option>
          <option value="full">Full</option>
          <option value="auto">Auto</option>
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
          {[64, 96, 120, 128, 160, 192, 256, 512, 1024].map((size) => (
            <option key={size} value={size.toString()}>{`${size} px`}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Logo;
