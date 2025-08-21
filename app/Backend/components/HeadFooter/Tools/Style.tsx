"use client";
import React from "react";

interface StyleProps {
  postData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setPostData: React.Dispatch<React.SetStateAction<any>>;
}

const Style: React.FC<StyleProps> = ({ postData, handleChange, setPostData }) => {
  return (
    <>
      {/* Font Size */}
      <div>
        <label className="block text-gray-400 mb-1">Font Size</label>
        <input
          type="number"
          name="FontSize"
          value={postData.FontSize || ""}
          onChange={handleChange}
          placeholder="e.g. 16"
          className="w-full border rounded p-2"
        />
      </div>

      {/* Font Text */}
      <div>
        <label className="block text-gray-400 mb-1">Font Text</label>
        <select
          name="FontText"
          value={postData.FontText || ""}
          onChange={handleChange}
          className="w-full border rounded p-2 capitalize"
        >
          <option value="">Select font</option>
          <option value="arial">Arial</option>
          <option value="roboto">Roboto</option>
          <option value="helvetica">Helvetica</option>
          <option value="times new roman">Times New Roman</option>
          <option value="georgia">Georgia</option>
          <option value="verdana">Verdana</option>
          <option value="tahoma">Tahoma</option>
          <option value="courier new">Courier New</option>
          <option value="monospace">Monospace</option>
          <option value="sans-serif">Sans-serif</option>
          <option value="serif">Serif</option>
          <option value="cursive">Cursive</option>
          <option value="fantasy">Fantasy</option>
          <option value="system-ui">System UI</option>
          <option value="ui-sans-serif">UI Sans-serif</option>
          <option value="ui-serif">UI Serif</option>
          <option value="ui-monospace">UI Monospace</option>
          <option value="ui-rounded">UI Rounded</option>
          <option value="ui-display">UI Display</option>
          <option value="ui-button">UI Button</option>
        </select>
      </div>

      {/* Font Color */}
      <div>
        <label className="block text-gray-400 mb-1">Font Color</label>
        <input
          type="color"
          name="FontColor"
          value={postData.FontColor || "#000000"}
          onChange={handleChange}
          className="w-full h-10 border rounded"
        />
      </div>

      {/* Font Style */}
      <div>
        <label className="block text-gray-400 mb-1">Font Style</label>
        <select
          name="FontStyle"
          value={postData.FontStyle || ""}
          onChange={handleChange}
          className="w-full border rounded p-2 capitalize"
        >
          <option value="">Select font style</option>
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="oblique">Oblique</option>
        </select>
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-gray-400 mb-1">Font Weight</label>
        <select
          name="FontWeight"
          value={postData.FontWeight || ""}
          onChange={handleChange}
          className="w-full border rounded p-2 capitalize"
        >
          <option value="">Select font weight</option>
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="bolder">Bolder</option>
          <option value="lighter">Lighter</option>
        </select>
      </div>

      {/* Shadow */}
      <div>
        <label className="block text-gray-400 mb-1">Shadow</label>
        <select
          name="Shadow"
          value={postData.Shadow || ""}
          onChange={(e) =>
            setPostData((prev: any) => ({ ...prev, Shadow: e.target.value }))
          }
          className="w-full border rounded p-2 capitalize"
        >
          <option value="">None</option>
          <option value="shadow-sm">Small</option>
          <option value="shadow">Default</option>
          <option value="shadow-md">Medium</option>
          <option value="shadow-lg">Large</option>
          <option value="shadow-xl">Extra Large</option>
          <option value="shadow-2xl">2x Extra Large</option>
        </select>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-gray-400 mb-1">Background Color</label>
        <input
          type="color"
          name="BackgroundColor"
          value={postData.BackgroundColor || "#ffffff"}
          onChange={handleChange}
          className="w-full h-10 border rounded"
        />
      </div>

      {/* Container Type */}
      <div>
        <label className="block text-gray-400 mb-1">Container Type</label>
        <select
          name="ContainerType"
          value={postData.ContainerType || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Select layout type</option>
          <option value="full">Full Width (Edge-to-edge)</option>
          <option value="boxed">Boxed (Centered with max-width)</option>
        </select>
      </div>

      {/* Border Rounded */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Border Rounded</label>
        <select
          name="BorderRounded"
          value={postData.BorderRounded || ""}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white"
        >
          <option value="">Select border radius</option>
          <option value="none">None</option>
          <option value="sm">Small (rounded-sm)</option>
          <option value="md">Medium (rounded-md)</option>
          <option value="lg">Large (rounded-lg)</option>
          <option value="xl">Extra Large (rounded-xl)</option>
          <option value="2xl">2x Extra Large (rounded-2xl)</option>
          <option value="full">Full (rounded-full)</option>
        </select>
      </div>
    </>
  );
};

export default Style;
