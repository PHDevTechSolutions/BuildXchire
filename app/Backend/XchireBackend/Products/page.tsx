"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import { ToastContainer, toast } from "react-toastify";
import Form from "../../components/Products/Form";
import Table from "../../components/Products/Table";
import Filters from "../../components/Products/Filters";
import Pagination from "../../components/Products/Pagination";

export default function Products() {
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
    const [productStatusFilter, setProductStatusFilter] = useState("All");

    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    const initialFormState = {
        ProductName: "",
        ProductDescription: "",
        ProductImage: "",
        ProductStatus: "",
        ProductGallery: "",
        ProductCategory: "",
        ProductTag: "",
        ProductBrand: "",
        ProductPrice: "",
        ProductSku: "",
        StockStatus: "",
        ProductWeight: "",
        ProductLength: "",
        ProductWidth: "",
        ProductHeight: "",
        EnableReview: "",
        MenuOrder: "",
        ProductBadge: "",
        ProductBarcode: "",
        ProductSalePrice: "",
        ProductShortDescription: "",
        ProductStockQuantity: "",
        PurchaseNote: "",
        ShippingClass: "",
    };

    const [productData, setProductData] = useState(initialFormState);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    const fetchProducts = async (refId: string) => {
        try {
            const res = await fetch(`/api/Backend/Products/fetch?id=${refId}`);
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
                fetchProducts(data.ReferenceID);
            } catch (err) {
                toast.error("Failed to fetch user data.");
            }
        })();
    }, []);

    useEffect(() => {
        let filtered = posts;
        if (searchTerm) {
            filtered = filtered.filter((post) =>
                post.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (productStatusFilter !== "All") {
            filtered = filtered.filter(post => post.ProductStatus === productStatusFilter);
        }
        setFilteredPosts(filtered);
    }, [posts, searchTerm, productStatusFilter]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handleEdit = (product: any) => {
        setProductData(product);
        setEditingProductId(product._id);
        setIsEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`/api/Backend/Products/delete?id=${id}`, { method: "DELETE" });
            const result = await res.json();
            if (res.ok) {
                toast.success("Product deleted");
                fetchProducts(userDetails.ReferenceID);
            } else {
                toast.error(result.message || "Delete failed");
            }
        } catch (err) {
            toast.error("Error deleting product");
        }
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <div className="container mx-auto p-4 text-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-1">
                        <h1 className="text-2xl font-bold mb-6">Product List</h1>

                        {showForm && (
                            <Form
                                showForm={showForm}
                                isEditMode={isEditMode}
                                productData={productData}
                                initialFormState={initialFormState}
                                setProductData={setProductData}
                                setShowForm={setShowForm}
                                setIsEditMode={setIsEditMode}
                                editingProductId={editingProductId}
                                setEditingProductId={setEditingProductId}
                                fetchProducts={fetchProducts}
                                userDetails={userDetails}
                            />
                        )}

                        {!showForm && (
                            <>
                                <div className="mb-4 p-4 bg-white shadow-md rounded-lg text-gray-900">
                                    <Filters
                                        searchTerm={searchTerm}
                                        productStatusFilter={productStatusFilter}
                                        setSearchTerm={setSearchTerm}
                                        setProductStatusFilter={setProductStatusFilter}
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