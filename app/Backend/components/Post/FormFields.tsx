"use client";

import React, { useState, useEffect } from "react";
import { Editor } from '@tinymce/tinymce-react';
import Select from "react-select";

interface FormFieldsProps {
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

const generateSlug = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

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
    const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);
    const [tagOptions, setTagOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/Backend/Posts/fetchcategory");
                const data = await res.json();
                const options = Array.isArray(data)
                    ? data.map((cat: any) => ({
                        label: cat.CategoryName,
                        value: cat.CategoryName,
                    }))
                    : [];
                setCategoryOptions(options);
            } catch {
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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPostData((prev: any) => ({
            ...prev,
            PostTitle: value,
            Slug: generateSlug(value),
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="text-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold mb-1">Title</label>
                    <input
                        name="PostTitle"
                        value={postData.PostTitle || ""}
                        onChange={handleTitleChange}
                        placeholder="Title"
                        className="border rounded p-2 text-xs w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Slug</label>
                    <input
                        name="Slug"
                        value={postData.Slug || ""}
                        readOnly
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold mb-1">Description</label>
                    <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                        value={postData.PostDescription || ""}
                        onEditorChange={(content) =>
                            setPostData((prev: any) => ({
                                ...prev,
                                PostDescription: content,
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
                    <label className="block text-xs font-bold mb-1">Category</label>
                    <Select
                        name="PostCategory"
                        options={categoryOptions}
                        value={categoryOptions.filter(opt => (postData.PostCategory || []).includes(opt.value))}
                        onChange={(selected) => {
                            setPostData((prev: any) => ({
                                ...prev,
                                PostCategory: selected ? selected.map((s: any) => s.value) : [],
                            }));
                        }}
                        placeholder="Select Category"
                        className="text-xs"
                        classNamePrefix="react-select"
                        isClearable
                        isMulti
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Tags</label>
                    <Select
                        name="PostTags"
                        options={tagOptions}
                        value={tagOptions.filter(opt => (postData.PostTags || []).includes(opt.value))}
                        onChange={(selected) => {
                            setPostData((prev: any) => ({
                                ...prev,
                                PostTags: selected ? selected.map((s: any) => s.value) : [],
                            }));
                        }}
                        placeholder="Select Tags"
                        className="text-xs"
                        classNamePrefix="react-select"
                        isClearable
                        isMulti
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Featured Image</label>
                    <input type="file" accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file)
                                handleImageUpload(file, (url) =>
                                    setPostData((prev: any) => ({ ...prev, FeaturedImage: url }))
                                );
                        }}
                        className="border rounded p-2 text-xs w-full"
                    />
                    {postData.FeaturedImage?.trim() !== "" && (
                        <img
                            src={postData.FeaturedImage}
                            alt="Featured Image"
                            className="mt-2 w-auto h-auto object-cover border"
                        />
                    )}
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Status</label>
                    <select
                        name="PostStatus"
                        value={postData.PostStatus || ""}
                        onChange={handleChange}
                        className="border rounded p-2 text-xs w-full"
                    >
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="Private">Private</option>
                        <option value="Published">Published</option>
                    </select>
                </div>
                {/* Seo */}
                <div>
                    <label className="block text-xs font-bold mb-1">SEO Keywords</label>
                    <input
                        name="SEOKeywords"
                        value={postData.SEOKeywords || ""}
                        onChange={handleChange}
                        placeholder="SEO Keywords (comma separated)"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">SEO Title</label>
                    <input
                        name="SEOTitle"
                        value={postData.SEOTitle || ""}
                        onChange={handleChange}
                        placeholder="SEO Title"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold mb-1">Meta Description</label>
                    <textarea
                        name="SEODescription"
                        value={postData.SEODescription || ""}
                        onChange={handleChange}
                        placeholder="SEO Description"
                        className="border rounded p-2 text-xs w-full h-24"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Slug</label>
                    <input
                        name="SEOSlug"
                        value={postData.SEOSlug || ""}
                        onChange={handleChange}
                        placeholder="SEO Slug"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Canonical URL</label>
                    <input
                        name="CanonicalURL"
                        value={postData.CanonicalURL || ""}
                        onChange={handleChange}
                        placeholder="Canonical URL"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Breadcrumbs Title</label>
                    <input
                        name="BreadcrumbsTitle"
                        value={postData.BreadcrumbsTitle || ""}
                        onChange={handleChange}
                        placeholder="Breadcrumbs Title"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-xs"
                >
                    {isEditMode ? "Update Post" : "Save Post"}
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

export default FormFields;