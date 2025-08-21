"use client";

import React from "react";
import LeftBar from "./Leftbar";
import HeaderPreview from "./Preview/Header";
import FooterPreview from "./Preview/Footer";

interface FormFieldsProps {
  postData: any;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleImageUpload: (file: File, callback: (url: string) => void) => void;
  setPostData: React.Dispatch<React.SetStateAction<any>>;
  setShowForm: (show: boolean) => void;
  setIsEditMode: (edit: boolean) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode: boolean;
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
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left Column - Form */}
      <LeftBar
        postData={postData}
        handleChange={handleChange}
        handleImageUpload={handleImageUpload}
        setPostData={setPostData}
        setShowForm={setShowForm}
        setIsEditMode={setIsEditMode}
        handleSubmit={handleSubmit}
        isEditMode={isEditMode}
        initialFormState={initialFormState}
      />

      {/* Right Column - Conditional Preview */}
      {postData?.Type === "Header" ? (
        <HeaderPreview postData={postData} />
      ) : postData?.Type === "Footer" ? (
        <FooterPreview postData={postData} />
      ) : (
        <div className="col-span-2 flex items-center justify-center border p-4 rounded shadow-sm">
          <p className="text-gray-500 text-sm">Please select Header or Footer</p>
        </div>
      )}
    </div>
  );
};

export default FormFields;
