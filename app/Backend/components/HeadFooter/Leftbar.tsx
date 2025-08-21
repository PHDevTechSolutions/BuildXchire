"use client";

import React from "react";
import Style from "./Tools/Style";
import Logo from "./Tools/Logo";
import Social from "./Tools/Social";

interface LeftBarProps {
    postData: any;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    handleImageUpload: (file: File, callback: (url: string) => void) => void;
    setPostData: React.Dispatch<React.SetStateAction<any>>;
    setShowForm: (show: boolean) => void;
    setIsEditMode: (edit: boolean) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditMode: boolean;
    initialFormState: any;
}

const LeftBar: React.FC<LeftBarProps> = ({
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
        <form
            onSubmit={handleSubmit}
            className="col-span-1 text-xs space-y-4 border p-4 rounded shadow-sm overflow-y-auto h-[calc(100vh-4rem)]"
        >
            {/* Title */}
            <div>
                <label className="block text-gray-400 mb-1">Title</label>
                <input
                    type="text"
                    name="Title"
                    value={postData.Title || ""}
                    onChange={handleChange}
                    placeholder="Enter title"
                    className="w-full border rounded p-2"
                />
            </div>

            {/* Type */}
            <div>
                <label className="block text-gray-400 mb-1">Type</label>
                <select
                    name="Type"
                    value={postData.Type || ""}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                >
                    <option value="">Select type</option>
                    <option value="Header">Header</option>
                    <option value="Footer">Footer</option>
                </select>
            </div>

            {/* Conditions */}
            <div>
                <label className="block text-gray-400 mb-1">Conditions</label>
                <input
                    type="text"
                    name="Conditions"
                    value={postData.Conditions || ""}
                    onChange={handleChange}
                    placeholder="e.g. visible on hover"
                    className="w-full border rounded p-2"
                />
            </div>

            <Style postData={postData} handleChange={handleChange} setPostData={setPostData} />

            <Logo
                postData={postData}
                setPostData={setPostData}
                handleChange={handleChange}
                handleImageUpload={handleImageUpload}
            />

            {/* Extra fields kapag Footer */}
            {postData.Type === "Footer" && (
                <div className="mt-4 space-y-4">
                    {/* Address */}
                    <div>
                        <label className="block text-gray-400 mb-1">Address</label>
                        <input
                            type="text"
                            name="Address"
                            value={postData.Address || ""}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            placeholder="Enter address"
                        />
                    </div>
                </div>
            )}

            {/* Extra fields kapag Header */}
            {postData.Type === "Header" && (
                <div className="mt-4 space-y-4">
                    {/* Phone Number */}
                    <div>
                        <label className="block text-gray-400 mb-1">Phone</label>
                        <input
                            type="text"
                            name="Phone"
                            value={postData.Phone || ""}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            placeholder="Enter phone number"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            name="Email"
                            value={postData.Email || ""}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            placeholder="Enter email"
                        />
                    </div>

                    <Social postData={postData} handleChange={handleChange} />
                </div>
            )}

            {/* Submit / Cancel Buttons */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-xs"
                >
                    {isEditMode ? "Update" : "Submit"}
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
        </form>
    );
};

export default LeftBar;
