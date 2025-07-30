"use client";

import React from "react";

interface FormFieldsProps {
    tagData: any;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    handleImageUpload: (file: File, callback: (url: string) => void) => void;
    setTagData: React.Dispatch<React.SetStateAction<any>>;
    setShowForm: (show: boolean) => void;
    setIsEditMode: (edit: boolean) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditMode: boolean;
    initialFormState: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    tagData,
    handleChange,
    handleImageUpload,
    setTagData,
    setShowForm,
    setIsEditMode,
    handleSubmit,
    isEditMode,
    initialFormState,
}) => {
    return (
        <form onSubmit={handleSubmit} className="text-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="TagName"
                    value={tagData.TagName || ""}
                    onChange={handleChange}
                    placeholder="Tag Name"
                    className="border rounded p-2 text-xs"
                    required
                />

                {/* Thumbnail Upload */}
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                handleImageUpload(file, (url) =>
                                    setTagData((prev: any) => ({ ...prev, Thumbnail: url }))
                                );
                            }
                        }}
                        className="border rounded p-2 text-xs w-full"
                    />
                    {tagData.Thumbnail?.trim() !== "" && (
                        <img
                            src={tagData.Thumbnail}
                            alt="Thumbnail Preview"
                            className="mt-2 w-24 h-24 object-cover border"
                        />
                    )}
                </div>

                <input
                    name="Slug"
                    value={tagData.Slug || ""}
                    onChange={(e) => {
                        const rawValue = e.target.value;
                        const slug = rawValue
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, "")
                            .replace(/\s+/g, "-")
                            .replace(/-+/g, "-");
                        setTagData((prev: any) => ({ ...prev, Slug: slug }));
                    }}
                    placeholder="Slug (e.g. 'nike-shoes')"
                    className="border rounded p-2 text-xs"
                />


                <textarea
                    name="Description"
                    value={tagData.Description || ""}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border rounded p-2 text-xs resize-none h-24 md:h-full"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-xs"
                >
                    {isEditMode ? "Update Category" : "Save Category"}
                </button>
                <button
                    type="button"
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 text-xs"
                    onClick={() => {
                        setShowForm(false);
                        setIsEditMode(false);
                        setTagData(initialFormState);
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default FormFields;
