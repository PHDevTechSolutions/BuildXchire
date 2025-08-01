"use client";

import React from "react";

interface Product {
    _id: string;
    Title: string;
    Type: string;
    Conditions: string;
    updatedAt: string;
}

interface TableProps {
    currentPosts: Product[];
    handleEdit: (product: Product) => void;
    handleDelete: (id: string) => void;
}

const Table: React.FC<TableProps> = ({ currentPosts, handleEdit, handleDelete }) => {
    return (
        <table className="min-w-full table-auto border border-gray-300 text-xs">
            <thead>
                <tr className="bg-gray-200 text-left">
                    <th className="border px-4 py-2">Title</th>
                    <th className="border px-4 py-2">Type</th>
                    <th className="border px-4 py-2">Condition</th>
                    <th className="border px-4 py-2">Updated At</th>
                </tr>
            </thead>
            <tbody>
                {currentPosts.length > 0 ? (
                    currentPosts.map((post, index) => (
                        <tr key={index} className="group hover:bg-gray-50">
                            <td className="border px-4 py-2">
                                <div className="flex flex-col">
                                    <span>{post.Title}</span>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs mt-1">
                                        <button
                                            className="text-blue-600 mr-2 hover:underline"
                                            onClick={() => handleEdit(post)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => handleDelete(post._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td className="border px-4 py-2">{post.Type}</td>
                            <td className="border px-4 py-2">{post.Conditions}</td>
                            <td className="border px-4 py-2">
                                {new Date(post.updatedAt).toLocaleString("en-PH", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={9} className="text-center border p-4">
                            No page found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Table;
