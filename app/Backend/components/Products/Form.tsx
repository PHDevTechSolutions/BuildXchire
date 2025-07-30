"use client";

import React from "react";
import { toast } from "react-toastify";

import FormFields from "./FormFields";

interface FormProps {
  showForm: boolean;
  isEditMode: boolean;
  productData: any;
  initialFormState: any;
  setProductData: (data: any) => void;
  setShowForm: (val: boolean) => void;
  setIsEditMode: (val: boolean) => void;
  editingProductId: string | null;
  setEditingProductId: (val: string | null) => void;
  userDetails: any;
  fetchProducts: (refId: string) => void;
}

const Form: React.FC<FormProps> = ({
  showForm,
  isEditMode,
  productData,
  initialFormState,
  setProductData,
  setShowForm,
  setIsEditMode,
  editingProductId,
  setEditingProductId,
  userDetails,
  fetchProducts,
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProductData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...productData,
      ReferenceID: userDetails.ReferenceID,
      createdBy: userDetails.UserId,
    };

    const url = isEditMode
      ? `/api/Backend/Products/edit?id=${editingProductId}`
      : "/api/Backend/Products/create";

    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(isEditMode ? "Product updated!" : "Product added!");
        setShowForm(false);
        setIsEditMode(false);
        setEditingProductId(null);
        setProductData(initialFormState);
        fetchProducts(userDetails.ReferenceID);
      } else {
        toast.error(result.message || "Error occurred.");
      }
    } catch (error) {
      toast.error("Failed to save product.");
    }
  };

  const handleImageUpload = async (file: File, setField: (url: string) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "BuildXchire");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxnk3mexu/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (data.secure_url) {
      setField(data.secure_url);
    } else {
      console.error("Cloudinary upload error:", data);
    }
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files) return;
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("upload_preset", "BuildXchire");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxnk3mexu/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        urls.push(data.secure_url);
      } else {
        console.error("Cloudinary gallery upload error:", data);
      }
    }

    setProductData((prev: any) => ({
      ...prev,
      ProductGallery: urls.join(","),
    }));
  };

  if (!showForm) return null;

  const galleryImages = productData.ProductGallery
    ? productData.ProductGallery.split(",")
    : [];


  return (
    <FormFields
      productData={productData}
      handleChange={handleChange}
      handleImageUpload={handleImageUpload}
      handleGalleryUpload={handleGalleryUpload}
      galleryImages={galleryImages}
      setProductData={setProductData}
      setShowForm={setShowForm}
      setIsEditMode={setIsEditMode}
      handleSubmit={handleSubmit}
      isEditMode={isEditMode}
      initialFormState={initialFormState}
    />
  );
};

export default Form;