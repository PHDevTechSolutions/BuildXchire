"use client";

import React from "react";

interface ContainerWidgetProps {
  index: number;
  postData: any;
  setPostData: React.Dispatch<React.SetStateAction<any>>;
  setEditingWidget: React.Dispatch<React.SetStateAction<string | null>>;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  containerData: Record<number, { children: string[] }>;
  setContainerData: React.Dispatch<
    React.SetStateAction<Record<number, { children: string[] }>>
  >;
}

const ContainerWidget: React.FC<ContainerWidgetProps> = ({
  index,
  postData,
  setPostData,
  setEditingWidget,
  setEditingIndex,
  containerData,
  setContainerData,
}) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedChildren = [e.target.value];
    const updated = { ...containerData, [index]: { children: updatedChildren } };
    setContainerData(updated);

    const html = `<div class="p-4 border rounded bg-gray-100">${updatedChildren[0]}</div>`;
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
      <div className="font-bold mb-2 text-xs">Edit Container</div>
      <label className="block text-[10px] font-bold mb-1">Content</label>
      <textarea
        value={containerData[index]?.children[0] || ""}
        onChange={handleContentChange}
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

export default ContainerWidget;
