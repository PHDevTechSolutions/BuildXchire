"use client";

import React from "react";

interface FormFieldsProps {
    brandData: any;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    handleImageUpload: (file: File, callback: (url: string) => void) => void;
    setBrandData: React.Dispatch<React.SetStateAction<any>>;
    setShowForm: (show: boolean) => void;
    setIsEditMode: (edit: boolean) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditMode: boolean;
    initialFormState: any;
}

const generateSlug = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

const FormFields: React.FC<FormFieldsProps> = ({
    brandData,
    handleChange,
    handleImageUpload,
    setBrandData,
    setShowForm,
    setIsEditMode,
    handleSubmit,
    isEditMode,
    initialFormState,
}) => {
    // Update slug automatically when BrandName changes
    const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBrandData((prev: any) => ({
            ...prev,
            BrandName: value,
            Slug: generateSlug(value),
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="text-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="BrandName"
                    value={brandData.BrandName || ""}
                    onChange={handleBrandNameChange}
                    placeholder="Brand Name"
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
                                    setBrandData((prev: any) => ({ ...prev, Thumbnail: url }))
                                );
                            }
                        }}
                        className="border rounded p-2 text-xs w-full"
                    />
                    {brandData.Thumbnail?.trim() !== "" && (
                        <img
                            src={brandData.Thumbnail}
                            alt="Thumbnail Preview"
                            className="mt-2 w-24 h-24 object-cover border"
                        />
                    )}
                </div>

                <input
                    name="Slug"
                    value={brandData.Slug || ""}
                    readOnly
                    placeholder="Slug (e.g. 'nike-shoes')"
                    className="border rounded p-2 text-xs bg-gray-100"
                />

                <textarea
                    name="Description"
                    value={brandData.Description || ""}
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
                    {isEditMode ? "Update Brand" : "Save Brand"}
                </button>
                <button
                    type="button"
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 text-xs"
                    onClick={() => {
                        setShowForm(false);
                        setIsEditMode(false);
                        setBrandData(initialFormState);
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default FormFields