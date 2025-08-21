"use client";

import React from "react";

interface TextWidgetProps {
    index: number;
    headingData: Record<number, { fontSize: string; fontFamily: string; text: string }>;
    setHeadingData: React.Dispatch<
        React.SetStateAction<Record<number, { fontSize: string; fontFamily: string; text: string }>>
    >;
    postData: any;
    setPostData: React.Dispatch<any>;
    setEditingWidget: React.Dispatch<React.SetStateAction<string | null>>;
    setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const TextWidget: React.FC<TextWidgetProps> = ({
    index,
    headingData,
    setHeadingData,
    postData,
    setPostData,
    setEditingWidget,
    setEditingIndex,
}) => {
    const updateHeading = (
        field: "fontSize" | "fontFamily" | "text",
        value: string
    ) => {
        const current = headingData[index] || {
            fontSize: "20px",
            fontFamily: "Arial",
            text: "Heading",
        };
        const updated = { ...current, [field]: value };

        setHeadingData((prev) => ({
            ...prev,
            [index]: updated,
        }));

        const html = `<h1 style="font-size: ${updated.fontSize}; font-family: ${updated.fontFamily};">${updated.text}</h1>`;
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
            <div className="font-bold mb-2 text-xs">Edit Heading</div>

            <label className="text-[10px] font-bold mb-1">Text</label>
            <input
                value={headingData[index]?.text || ""}
                onChange={(e) => updateHeading("text", e.target.value)}
                className="border rounded p-1 w-full text-xs mb-2"
            />

            <label className="text-[10px] font-bold mb-1">Font Size</label>
            <input
                value={headingData[index]?.fontSize || ""}
                onChange={(e) => updateHeading("fontSize", e.target.value)}
                className="border rounded p-1 w-full text-xs mb-2"
            />

            <label className="text-[10px] font-bold mb-1">Font Family</label>
            <input
                value={headingData[index]?.fontFamily || ""}
                onChange={(e) => updateHeading("fontFamily", e.target.value)}
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

export default TextWidget;
