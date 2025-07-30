import React from "react";
import Select from "react-select";
import { Editor } from '@tinymce/tinymce-react';

interface InformationTabProps {
    productData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleImageUpload: (file: File, callback: (url: string) => void) => void;
    handleGalleryUpload: (files: FileList | null) => void;
    galleryImages: string[];
    setProductData: React.Dispatch<React.SetStateAction<any>>;
    categoryOptions: { label: string; value: string }[];
    tagOptions: { label: string; value: string }[];
    brandOptions: { label: string; value: string }[];
}

const InformationTab: React.FC<InformationTabProps> = ({
    productData,
    handleChange,
    handleImageUpload,
    handleGalleryUpload,
    galleryImages,
    setProductData,
    categoryOptions,
    tagOptions,
    brandOptions,
}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
            <label className="block text-xs font-bold mb-1">Product Name</label>
            <input name="ProductName" value={productData.ProductName || ""} onChange={handleChange}
                placeholder="Product Name"
                className="border rounded p-2 text-xs w-full"
                required
            />
        </div>
        <div className="md:col-span-2">
            <label className="block text-xs font-bold mb-1">Product Description</label>
            <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={productData.ProductDescription || ""}
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
        <div className="md:col-span-2">
            <label className="block text-xs font-bold mb-1">Product Short Description</label>
            <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={productData.ProductShortDescription || ""}
                onEditorChange={(content) =>
                    setProductData((prev: any) => ({
                        ...prev,
                        ProductShortDescription: content,
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

        <div>
            <label className="block text-xs font-bold mb-1">Product Image</label>
            <input type="file" accept="image/*"
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
        <div>
            <label className="block text-xs font-bold mb-1">Status</label>
            <select
                name="ProductStatus"
                value={productData.ProductStatus || ""}
                onChange={handleChange}
                className="border rounded p-2 text-xs w-full">
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
            </select>
        </div>
        <div className="md:col-span-2">
            <label className="block text-xs font-bold mb-1">Product Gallery</label>
            <input type="file" accept="image/*" multiple
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
        <div>
            <label className="block text-xs font-bold mb-1">Categories</label>
            <Select
                name="ProductCategory"
                options={categoryOptions}
                value={categoryOptions.filter(opt => (productData.ProductCategory || []).includes(opt.value))}
                onChange={(selected) => {
                    setProductData((prev: any) => ({
                        ...prev,
                        ProductCategory: selected ? selected.map((s: any) => s.value) : [],
                    }));
                }}
                placeholder="Select Category"
                className="text-xs"
                classNamePrefix="react-select"
                isClearable
                isMulti
            />
            <label className="block text-xs font-bold mb-1 mt-2">Tags</label>
            <Select
                name="ProductTag"
                options={tagOptions}
                value={tagOptions.filter(opt => (productData.ProductTag || []).includes(opt.value))}
                onChange={(selected) => {
                    setProductData((prev: any) => ({
                        ...prev,
                        ProductTag: selected ? selected.map((s: any) => s.value) : [],
                    }));
                }}
                placeholder="Select Tags"
                className="text-xs"
                classNamePrefix="react-select"
                isClearable
                isMulti
            />
        </div>
        <div className="col-span-1">
            <label className="block text-xs font-bold mb-1">Brand</label>
            <Select
                name="ProductBrand"
                options={brandOptions}
                value={brandOptions.filter(opt => (productData.ProductBrand || []).includes(opt.value))}
                onChange={(selected) => {
                    setProductData((prev: any) => ({
                        ...prev,
                        ProductBrand: selected ? selected.map((s: any) => s.value) : [],
                    }));
                }}
                placeholder="Select Brand"
                className="text-xs"
                classNamePrefix="react-select"
                isClearable
                isMulti
            />
        </div>
    </div>
);

export default InformationTab;