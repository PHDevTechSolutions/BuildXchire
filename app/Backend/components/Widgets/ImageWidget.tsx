"use client";

import React from "react";

interface ImageWidgetProps {
  index: number;
  postData: any;
  setPostData: React.Dispatch<React.SetStateAction<any>>;
  setEditingWidget: React.Dispatch<React.SetStateAction<string | null>>;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  imageData: Record<number, { src: string }>; // <- updated here
  setImageData: React.Dispatch<React.SetStateAction<Record<number, { src: string }>>>;
}

const ImageWidget: React.FC<ImageWidgetProps> = ({
  index,
  postData,
  setPostData,
  setEditingWidget,
  setEditingIndex,
  imageData,
  setImageData,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updated = { ...imageData, [index]: { src: value } };
    setImageData(updated);

    const html = `<img src="${value}" alt="Image Widget" class="rounded shadow w-32 h-32 object-cover"/>`;
    const updatedWidgets = postData.widgets.map((w: string, i: number) =>
      i === index ? html : w
    );

    setPostData((prev: any) => ({
      ...prev,
      widgets: updatedWidgets,
      HtmlCode: updatedWidgets.join("\n"),
    }));
  };

  return (
    <>
      <div className="font-bold mb-2 text-xs">Edit Image</div>

      <label className="block text-[10px] font-bold mb-1">Image URL</label>
      <input
        type="text"
        value={imageData[index]?.src || ""}
        onChange={handleChange}
        className="border rounded p-1 w-full text-xs mb-4"
      />
      <button
        onClick={() => {
          setEditingWidget(null);
          setEditingIndex(null);
        }}
        className="bg-gray-400 text-white px-3 py-1 text-xs rounded hover:bg-gray-600"
      >
        Back to Widgets
      </button>

    </>
  );
};

export default ImageWidget;
