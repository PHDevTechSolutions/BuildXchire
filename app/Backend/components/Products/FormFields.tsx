import React, { useState, useEffect } from "react";
import InformationTab from "./InformationTab";
import ProductDataTab from "./ProductDataTab";

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
    const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);
    const [tagOptions, setTagOptions] = useState<{ label: string; value: string }[]>([]);
    const [brandOptions, setBrandOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`/api/Backend/Products/fetchcategory`);
                const data = await res.json();
                const options = Array.isArray(data)
                    ? data.map((cat: any) => ({
                        label: cat.CategoryName,
                        value: cat.CategoryName,
                    }))
                    : [];
                setCategoryOptions(options);
            } catch (error) {
                setCategoryOptions([]);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchTag = async () => {
            try {
                const res = await fetch(`/api/Backend/Products/fetchtag`);
                const data = await res.json();
                const options = Array.isArray(data)
                    ? data.map((cat: any) => ({
                        label: cat.TagName,
                        value: cat.TagName,
                    }))
                    : [];
                setTagOptions(options);
            } catch (error) {
                setTagOptions([]);
            }
        };
        fetchTag();
    }, []);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const res = await fetch(`/api/Backend/Products/fetchbrand`);
                const data = await res.json();
                const options = Array.isArray(data)
                    ? data.map((cat: any) => ({
                        label: cat.BrandName,
                        value: cat.BrandName,
                    }))
                    : [];
                setBrandOptions(options);
            } catch (error) {
                setBrandOptions([]);
            }
        };
        fetchBrand();
    }, []);

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
                <InformationTab
                    productData={productData}
                    handleChange={handleChange}
                    handleImageUpload={handleImageUpload}
                    handleGalleryUpload={handleGalleryUpload}
                    galleryImages={galleryImages}
                    setProductData={setProductData}
                    categoryOptions={categoryOptions}
                    tagOptions={tagOptions}
                    brandOptions={brandOptions}
                />
            )}

            {/* Product Data Tab */}
            {mainTab === "Product Data" && (
                <ProductDataTab
                    productData={productData}
                    productDataTab={productDataTab}
                    setProductDataTab={setProductDataTab}
                    handleChange={handleChange}
                />
            )}

            {/* Submit / Cancel Buttons */}
            <div className="flex gap-4 mt-6">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-xs">
                    {isEditMode ? "Update Product" : "Save Product"}
                </button>
                
                <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 text-xs"
                    onClick={() => {
                        setShowForm(false);
                        setIsEditMode(false);
                        setProductData(initialFormState);
                    }}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default FormFields;