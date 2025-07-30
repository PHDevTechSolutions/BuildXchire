"use client";

import React from "react";

interface Product {
  _id: string;
  PostTitle: string;
  FeaturedImage: string;
  ReferenceID: string;
  PostCategory: string[] | string;
  PostTags: string[] | string;
  SEOTitle: string;
  SEODescription: string;
  SEOKeywords: string;
  createdAt: string;
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
          <th className="border px-4 py-2">Author</th>
          <th className="border px-4 py-2">Categories</th>
          <th className="border px-4 py-2">Tags</th>
          <th className="border px-4 py-2">Date</th>
          <th className="border px-4 py-2">SEO Title</th>
          <th className="border px-4 py-2">Meta Description</th>
          <th className="border px-4 py-2">Keyphrase</th>
        </tr>
      </thead>
      <tbody>
        {currentPosts.length > 0 ? (
          currentPosts.map((post, index) => (
            <tr key={index} className="group hover:bg-gray-50">
              <td className="border px-4 py-2">
                <div className="flex flex-col">
                  <span>{post.PostTitle}</span>
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
              <td className="border px-4 py-2">{post.ReferenceID}</td>
              <td className="border px-4 py-2">
                {Array.isArray(post.PostCategory)
                  ? post.PostCategory.join(", ")
                  : post.PostCategory || "-"}
              </td>
              <td className="border px-4 py-2">
                {Array.isArray(post.PostTags)
                  ? post.PostTags.join(", ")
                  : post.PostTags || "-"}
              </td>
              <td className="border px-4 py-2">
                {new Date(post.createdAt).toLocaleString("en-PH", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="border px-4 py-2">{post.SEOTitle}</td>
              <td className="border px-4 py-2">{post.SEODescription}</td>
              <td className="border px-4 py-2">{post.SEOKeywords}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9} className="text-center border p-4">
              No products found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;