import React, { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';

interface FormFieldsProps {
    productData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleImageUpload: (file: File, callback: (url: string) => void) => void;
    handleGalleryUpload: (files: FileList | null) => void;
    galleryImages: string[];
    setProductData: React.Dispatch<React.SetStateAction<any>>;
    setShowForm: (show: boolean) => void;
    setIsEditMode: (edit: boolean) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditMode: boolean;
    initialFormState: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    productData,
    handleChange,
    handleImageUpload,
    handleGalleryUpload,
    galleryImages,
    setProductData,
    setShowForm,
    setIsEditMode,
    handleSubmit,
    isEditMode,
    initialFormState,
}) => {
    const [mainTab, setMainTab] = useState("Product Information");
    const [productDataTab, setProductDataTab] = useState("General");

    return (
        <form onSubmit={handleSubmit} className="text-xs space-y-4">
            {/* Main Tabs */}
            <div className="flex gap-4 border-b mb-4">
                {["Product Information", "Product Data"].map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setMainTab(tab)}
                        className={`px-3 py-2 text-xs font-medium ${mainTab === tab
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Product Information Tab */}
            {mainTab === "Product Information" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="ProductName"
                        value={productData.ProductName}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="border rounded p-2 text-xs"
                        required
                    />

                    <div className="md:col-span-2">
                        <Editor
                            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                            value={productData.ProductDescription}
                            onEditorChange={(content) =>
                                setProductData((prev: any) => ({
                                    ...prev,
                                    ProductDescription: content,
                                }))
                            }
                            init={{
                                height: 300,
                                plugins: [
                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image',
                                    'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                ],
                                toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist',
                                content_style: 'body { font-size: 12px; }',
                                fontsize_formats: '12px 14px 16px 18px 24px 36px',
                            }}
                        />

                    </div>

                    {/* Product Image Upload */}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file)
                                    handleImageUpload(file, (url) =>
                                        setProductData((prev: any) => ({ ...prev, ProductImage: url }))
                                    );
                            }}
                            className="border rounded p-2 text-xs w-full"
                        />
                        {productData.ProductImage?.trim() !== "" && (
                            <img
                                src={productData.ProductImage}
                                alt="Product Preview"
                                className="mt-2 w-24 h-24 object-cover border"
                            />
                        )}
                    </div>

                    <select
                        name="ProductStatus"
                        value={productData.ProductStatus}
                        onChange={handleChange}
                        className="border rounded p-2 text-xs"
                    >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                    </select>

                    {/* Product Gallery Upload */}
                    <div className="md:col-span-2">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleGalleryUpload(e.target.files)}
                            className="border rounded p-2 text-xs w-full"
                        />

                        {galleryImages.filter((img) => img?.trim() !== "").length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {galleryImages.map((img, i) => (
                                    <div key={i} className="relative w-16 h-16">
                                        <img
                                            src={img}
                                            alt={`Gallery ${i}`}
                                            className="w-full h-full object-cover border rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = galleryImages.filter((_, index) => index !== i);
                                                setProductData((prev: any) => ({
                                                    ...prev,
                                                    ProductGallery: updated.join(","),
                                                }));
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                            title="Remove"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <input
                        name="ProductCategory"
                        value={productData.ProductCategory}
                        onChange={handleChange}
                        placeholder="Category"
                        className="border rounded p-2 text-xs"
                    />

                    <input
                        name="ProductTag"
                        value={productData.ProductTag}
                        onChange={handleChange}
                        placeholder="Tags"
                        className="border rounded p-2 text-xs"
                    />
                </div>
            )}

            {/* Product Data Tab */}
            {mainTab === "Product Data" && (
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Left: Vertical Tabs */}
                    <div className="flex flex-col gap-2 border-r pr-4 min-w-[150px]">
                        {["General", "Inventory", "Shipping"].map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setProductDataTab(tab)}
                                className={`text-left px-3 py-2 border rounded text-xs ${productDataTab === tab
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Right: Tab Content */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {productDataTab === "General" && (
                            <input
                                type="number"
                                name="ProductPrice"
                                value={productData.ProductPrice}
                                onChange={handleChange}
                                placeholder="Price"
                                className="border rounded p-2 text-xs"
                                required
                            />
                        )}

                        {productDataTab === "Inventory" && (
                            <>
                                <input
                                    name="ProductSku"
                                    value={productData.ProductSku}
                                    onChange={handleChange}
                                    placeholder="SKU"
                                    className="border rounded p-2 text-xs"
                                />
                                <select
                                    name="StockStatus"
                                    value={productData.StockStatus}
                                    onChange={handleChange}
                                    className="border rounded p-2 text-xs"
                                >
                                    <option value="In Stock">In Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </select>
                            </>
                        )}

                        {productDataTab === "Shipping" && (
                            <>
                                <input
                                    type="number"
                                    name="ProductWeight"
                                    value={productData.ProductWeight}
                                    onChange={handleChange}
                                    placeholder="Weight (kg)"
                                    className="border rounded p-2 text-xs"
                                />
                                <input
                                    type="number"
                                    name="ProductLength"
                                    value={productData.ProductLength}
                                    onChange={handleChange}
                                    placeholder="Length"
                                    className="border rounded p-2 text-xs"
                                />
                                <input
                                    type="number"
                                    name="ProductWidth"
                                    value={productData.ProductWidth}
                                    onChange={handleChange}
                                    placeholder="Width"
                                    className="border rounded p-2 text-xs"
                                />
                                <input
                                    type="number"
                                    name="ProductHeight"
                                    value={productData.ProductHeight}
                                    onChange={handleChange}
                                    placeholder="Height"
                                    className="border rounded p-2 text-xs"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Submit / Cancel Buttons */}
            <div className="flex gap-4 mt-6">
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-xs"
                >
                    {isEditMode ? "Update Product" : "Save Product"}
                </button>
                <button
                    type="button"
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 text-xs"
                    onClick={() => {
                        setShowForm(false);
                        setIsEditMode(false);
                        setProductData(initialFormState);
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default FormFields;