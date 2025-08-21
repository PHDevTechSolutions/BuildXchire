"use client";

import React from "react";

interface ButtonWidgetProps {
    index: number;
    postData: any;
    setPostData: React.Dispatch<React.SetStateAction<any>>;
    setEditingWidget: React.Dispatch<React.SetStateAction<string | null>>;
    setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
    buttonData: Record<number, { text: string; color: string }>;
    setButtonData: React.Dispatch<
        React.SetStateAction<Record<number, { text: string; color: string }>>
    >;
}

const ButtonWidget: React.FC<ButtonWidgetProps> = ({
    index,
    postData,
    setPostData,
    setEditingWidget,
    setEditingIndex,
    buttonData,
    setButtonData,
}) => {
    const handleChange = (field: "text" | "color", value: string) => {
        const current = buttonData[index] || { text: "Button", color: "blue" };
        const updated = { ...current, [field]: value };
        setButtonData((prev) => ({ ...prev, [index]: updated }));

        const colorClass =
            updated.color === "blue"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 hover:bg-gray-700";

        const html = `<button class="${colorClass} text-white px-4 py-2 rounded text-xs">${updated.text}</button>`;

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
            <div className="font-bold mb-2 text-xs">Edit Button</div>

            <label className="block text-[10px] font-bold mb-1">Button Text</label>
            <input
                type="text"
                value={buttonData[index]?.text || ""}
                onChange={(e) => handleChange("text", e.target.value)}
                className="border rounded p-1 w-full text-xs mb-2"
                placeholder="Button Text"
            />

            <label className="block text-[10px] font-bold mb-1">Button Color</label>
            <select
                value={buttonData[index]?.color || "blue"}
                onChange={(e) => handleChange("color", e.target.value)}
                className="border rounded p-1 w-full text-xs mb-4"
            >
                <option value="blue">Blue</option>
                <option value="gray">Gray</option>
            </select>

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

export default ButtonWidget;
