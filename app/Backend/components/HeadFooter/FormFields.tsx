"use client";

import React, { useState } from "react";
import Widgets from "./Widgets";

interface FormFieldsProps {
    postData: any;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    handleImageUpload: (file: File, callback: (url: string) => void) => void;
    setPostData: React.Dispatch<React.SetStateAction<any>>;
    setShowForm: (show: boolean) => void;
    setIsEditMode: (edit: boolean) => void; isEditMode: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    initialFormState: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    postData,
    handleChange,
    handleImageUpload,
    setPostData,
    setShowForm,
    setIsEditMode,
    handleSubmit,
    isEditMode,
    initialFormState,
}) => {
    const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
    const widgets: string[] = postData.widgets || [];

    // Handle drop: append widget HTML to HtmlCode
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (draggedWidget) {
            const updatedWidgets = [...widgets, draggedWidget];
            setPostData((prev: any) => ({
                ...prev,
                widgets: updatedWidgets,
                HtmlCode: updatedWidgets.join("\n"),
            }));
            setDraggedWidget(null);
        }
    };

    const handleRemoveWidget = (idx: number) => {
        const updated = widgets.filter((_: string, i: number) => i !== idx);
        setPostData((prev: any) => ({
            ...prev,
            widgets: updated,
            HtmlCode: updated.join("\n"),
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="text-xs h-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
                {/* Left: Draggable Widgets Container */}
                <div className="md:col-span-3 bg-gray-50 border rounded p-4 flex flex-col">
                    <Widgets setDraggedWidget={setDraggedWidget} />
                </div>

                {/* Center: Live Preview (Drop Area) */}
                <div
                    className="md:col-span-6 flex flex-col items-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <div className="border rounded p-4 w-full bg-white min-h-[40vh]">
                        {widgets.length === 0 && (
                            <div className="text-gray-400 text-xs text-center">Drag and drop widgets here to build your page</div>
                        )}
                        {widgets.map((html: string, idx: number) => (
                            <div key={idx} className="relative group mb-2">
                                <div dangerouslySetInnerHTML={{ __html: html }} />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                                    onClick={() => handleRemoveWidget(idx)}
                                    title="Remove"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Hidden textarea for submitting HTML code */}
                    <textarea
                        name="HtmlCode"
                        value={postData.HtmlCode || ""}
                        placeholder="Drag and drop widgets here to build your page"
                        readOnly
                        hidden
                    />
                </div>

                {/* Right: Form Fields & Buttons */}
                <div className="md:col-span-3 flex flex-col justify-start items-end h-full border p-4 rounded">
                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-4">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-xs"
                        >
                            {isEditMode ? "Update" : "Save"}
                        </button>
                        <button
                            type="button"
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 text-xs"
                            onClick={() => {
                                setShowForm(false);
                                setIsEditMode(false);
                                setPostData(initialFormState);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Title</label>
                        <input
                            name="Title"
                            value={postData.Title || ""}
                            onChange={handleChange}
                            placeholder="Page Title"
                            className="border rounded p-2 text-xs w-full mb-2"
                            required
                        />
                        <label className="block text-xs font-bold mb-1">Type</label>
                        <select
                            name="Type"
                            value={postData.Type || ""}
                            onChange={handleChange}
                            className="border rounded p-2 text-xs w-full mb-2"
                        >
                            <option value="Footer">Footer</option>
                            <option value="Header">Header</option>
                        </select>
                        <label className="block text-xs font-bold mb-1">Conditions</label>
                        <select
                            name="Conditions"
                            value={postData.Conditions || ""}
                            onChange={handleChange}
                            className="border rounded p-2 text-xs w-full mb-2"
                        >
                            <option value="Specific Site">Specific Site</option>
                            <option value="Entire Site">Entire Site</option>
                        </select>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default FormFields;