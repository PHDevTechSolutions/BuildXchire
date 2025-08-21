"use client";

import React from "react";

interface SocialProps {
  postData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Social: React.FC<SocialProps> = ({ postData, handleChange }) => {
  return (
    <>
      {/* Facebook */}
      <div>
        <label className="block text-gray-400 mb-1">Facebook</label>
        <input
          type="text"
          name="Facebook"
          value={postData.Facebook || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Enter Facebook URL"
        />
      </div>

      {/* Twitter */}
      <div>
        <label className="block text-gray-400 mb-1">Twitter</label>
        <input
          type="text"
          name="Twitter"
          value={postData.Twitter || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Enter Twitter URL"
        />
      </div>

      {/* Instagram */}
      <div>
        <label className="block text-gray-400 mb-1">Instagram</label>
        <input
          type="text"
          name="Instagram"
          value={postData.Instagram || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Enter Instagram URL"
        />
      </div>

      {/* LinkedIn */}
      <div>
        <label className="block text-gray-400 mb-1">LinkedIn</label>
        <input
          type="text"
          name="LinkedIn"
          value={postData.LinkedIn || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Enter LinkedIn URL"
        />
      </div>

      {/* YouTube */}
      <div>
        <label className="block text-gray-400 mb-1">YouTube</label>
        <input
          type="text"
          name="YouTube"
          value={postData.YouTube || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Enter YouTube URL"
        />
      </div>

      {/* TikTok */}
      <div>
        <label className="block text-gray-400 mb-1">TikTok</label>
        <input
          type="text"
          name="TikTok"
          value={postData.TikTok || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Enter TikTok URL"
        />
      </div>
    </>
  );
};

export default Social;
