"use client";

import React from "react";

interface GridWidgetProps {
  index: number;
  postData: any;
  setPostData: React.Dispatch<React.SetStateAction<any>>;
  setEditingWidget: React.Dispatch<React.SetStateAction<string | null>>;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  gridData: Record<number, { columns: number; children: string[] }>;
  setGridData: React.Dispatch<
    React.SetStateAction<Record<number, { columns: number; children: string[] }>>
  >;
}

const GridWidget: React.FC<GridWidgetProps> = ({
  index,
  postData,
  setPostData,
  setEditingWidget,
  setEditingIndex,
  gridData,
  setGridData,
}) => {
  const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cols = parseInt(e.target.value, 10);
    const children = new Array(cols).fill("").map((_, i) => gridData[index]?.children[i] || "");
    const updated = { columns: cols, children };
    setGridData((prev) => ({ ...prev, [index]: updated }));

    updateHTML(updated);
  };

  const handleChildChange = (i: number, value: string) => {
    const current = gridData[index];
    const updatedChildren = [...(current?.children || [])];
    updatedChildren[i] = value;
    const updated = { columns: current.columns, children: updatedChildren };
    setGridData((prev) => ({ ...prev, [index]: updated }));

    updateHTML(updated);
  };

  const updateHTML = (data: { columns: number; children: string[] }) => {
    const colsClass = `grid-cols-${data.columns}`;
    const html = `<div class="grid ${colsClass} gap-4">${data.children
      .map((child) => `<div class="border p-2">${child}</div>`)
      .join("")}</div>`;

    const updatedWidgets = postData.widgets.map((w: string, i: number) =>
      i === index ? html : w
    );

    setPostData((prev: any) => ({
      ...prev,
      widgets: updatedWidgets,
      HtmlCode: updatedWidgets.join("\n"),
    }));
  };

  const current = gridData[index];

  return (
    <>
      <div className="font-bold mb-2 text-xs">Edit Grid</div>

      <label className="block text-[10px] font-bold mb-1">Number of Columns</label>
      <select
        value={current?.columns || 2}
        onChange={handleColumnChange}
        className="border rounded p-1 w-full text-xs mb-4"
      >
        {[1, 2, 3, 4].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      {current?.children.map((child, i) => (
        <div key={i} className="mb-2">
          <label className="block text-[10px] font-bold mb-1">Column {i + 1}</label>
          <input
            type="text"
            value={child}
            onChange={(e) => handleChildChange(i, e.target.value)}
            className="border rounded p-1 w-full text-xs"
          />
        </div>
      ))}

      <button
        onClick={() => {
          setEditingWidget(null);
          setEditingIndex(null);
        }}
        className="bg-gray-400 text-white px-3 py-1 text-xs rounded hover:bg-gray-600 mt-4"
      >
        Back to Widgets
      </button>
    </>
  );
};

export default GridWidget;
