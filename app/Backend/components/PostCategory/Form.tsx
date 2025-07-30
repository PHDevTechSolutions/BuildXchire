"use client";

import React from "react";
import { toast } from "react-toastify";

import FormFields from "./FormFields";

interface FormProps {
  showForm: boolean;
  isEditMode: boolean;
  categoryData: any;
  initialFormState: any;
  setCategoryData: (data: any) => void;
  setShowForm: (val: boolean) => void;
  setIsEditMode: (val: boolean) => void;
  editingCategoryId: string | null;
  setEditingCategoryId: (val: string | null) => void;
  userDetails: any;
  fetchCategory: (refId: string) => void;
}

const Form: React.FC<FormProps> = ({
  showForm,
  isEditMode,
  categoryData,
  initialFormState,
  setCategoryData,
  setShowForm,
  setIsEditMode,
  editingCategoryId,
  setEditingCategoryId,
  userDetails,
  fetchCategory,
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCategoryData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...categoryData,
      ReferenceID: userDetails.ReferenceID,
      createdBy: userDetails.UserId,
    };

    const url = isEditMode
      ? `/api/Backend/PostCategory/edit?id=${editingCategoryId}`
      : "/api/Backend/PostCategory/create";

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
        setEditingCategoryId(null);
        setCategoryData(initialFormState);
        fetchCategory(userDetails.ReferenceID);
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

  if (!showForm) return null;

  return (
    <FormFields
      categoryData={categoryData}
      handleChange={handleChange}
      handleImageUpload={handleImageUpload}
      setCategoryData={setCategoryData}
      setShowForm={setShowForm}
      setIsEditMode={setIsEditMode}
      handleSubmit={handleSubmit}
      isEditMode={isEditMode}
      initialFormState={initialFormState}
    />
  );
};

export default Form;