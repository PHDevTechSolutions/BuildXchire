"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import { ToastContainer, toast } from "react-toastify";
import Form from "../../components/Category/Form";
import Table from "../../components/Category/Table";
import Filters from "../../components/Category/Filters";
import Pagination from "../../components/Category/Pagination";

export default function Categories() {
    const [userDetails, setUserDetails] = useState({
        UserId: "",
        ReferenceID: "",
        Firstname: "",
        Lastname: "",
        Email: "",
        Role: "",
    });

    const [posts, setPosts] = useState<any[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    const initialFormState = {
        CategoryName: "",
        Slug: "",
        Description: "",
        Thumbnail: "",
    };

    const [categoryData, setCategoryData] = useState(initialFormState);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    const fetchCategory = async (refId: string) => {
        try {
            const res = await fetch(`/api/Backend/Category/fetch?id=${refId}`);
            const json = await res.json();
            setPosts(json.data || []);
        } catch (err) {
            toast.error("Failed to fetch products.");
        }
    };

    useEffect(() => {
        const userId = new URLSearchParams(window.location.search).get("id");
        if (!userId) return;

        (async () => {
            try {
                const res = await fetch(`/api/Backend/user?id=${encodeURIComponent(userId)}`);
                const data = await res.json();
                setUserDetails({
                    UserId: data._id,
                    ReferenceID: data.ReferenceID ?? "",
                    Firstname: data.Firstname ?? "",
                    Lastname: data.Lastname ?? "",
                    Email: data.Email ?? "",
                    Role: data.Role ?? "",
                });
                fetchCategory(data.ReferenceID);
            } catch (err) {
                toast.error("Failed to fetch user data.");
            }
        })();
    }, []);

    useEffect(() => {
        let filtered = posts;
        if (searchTerm) {
            filtered = filtered.filter((post) =>
                post.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredPosts(filtered);
    }, [posts, searchTerm]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handleEdit = (category: any) => {
        setCategoryData(category);
        setEditingCategoryId(category._id);
        setIsEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            const res = await fetch(`/api/Backend/Category/delete?id=${id}`, { method: "DELETE" });
            const result = await res.json();
            if (res.ok) {
                toast.success("Category deleted");
                fetchCategory(userDetails.ReferenceID);
            } else {
                toast.error(result.message || "Delete failed");
            }
        } catch (err) {
            toast.error("Error deleting category");
        }
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <div className="container mx-auto p-4 text-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-1">
                        <h1 className="text-2xl font-bold mb-6">Category List</h1>

                        {showForm && (
                            <Form
                                showForm={showForm}
                                isEditMode={isEditMode}
                                categoryData={categoryData}
                                initialFormState={initialFormState}
                                setCategoryData={setCategoryData}
                                setShowForm={setShowForm}
                                setIsEditMode={setIsEditMode}
                                editingCategoryId={editingCategoryId}
                                setEditingCategoryId={setEditingCategoryId}
                                fetchCategory={fetchCategory}
                                userDetails={userDetails}
                            />
                        )}

                        {!showForm && (
                            <>
                                <div className="mb-4 p-4 bg-white shadow-md rounded-lg text-gray-900">
                                    <Filters
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        onAddClick={() => setShowForm(true)}
                                    />

                                    <Table
                                        currentPosts={currentPosts}
                                        handleEdit={handleEdit}
                                        handleDelete={handleDelete}
                                    />

                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={(page) => setCurrentPage(page)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <ToastContainer className="text-xs" autoClose={1000} />
            </ParentLayout>
        </SessionChecker>
    );
}