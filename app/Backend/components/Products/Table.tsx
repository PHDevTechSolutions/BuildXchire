"use client";

import React from "react";

interface Product {
  _id: string;
  ProductName: string;
  ProductPrice: string;
  ProductStatus: string;
  ProductSku: string;
  ProductCategory: string[] | string;
  ProductTag: string[] | string;
  ProductBrand: string;
  ProductImage: string;
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
          <th className="border px-4 py-2">Image</th>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Price</th>
          <th className="border px-4 py-2">Status</th>
          <th className="border px-4 py-2">SKU</th>
          <th className="border px-4 py-2">Category</th>
          <th className="border px-4 py-2">Tags</th>
          <th className="border px-4 py-2">Brand</th>
          <th className="border px-4 py-2">Updated At</th>
        </tr>
      </thead>
      <tbody>
        {currentPosts.length > 0 ? (
          currentPosts.map((post, index) => (
            <tr key={index} className="group hover:bg-gray-50">
              <td className="border px-4 py-2">
                {post.ProductImage ? (
                  <img
                    src={post.ProductImage}
                    alt={post.ProductName}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </td>
              <td className="border px-4 py-2">
                <div className="flex flex-col">
                  <span>{post.ProductName}</span>
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
              <td className="border px-4 py-2">₱{post.ProductPrice}</td>
              <td className="border px-4 py-2">{post.ProductStatus}</td>
              <td className="border px-4 py-2">{post.ProductSku}</td>
              <td className="border px-4 py-2">
                {Array.isArray(post.ProductCategory)
                  ? post.ProductCategory.join(", ")
                  : post.ProductCategory || "-"}
              </td>
              <td className="border px-4 py-2">
                {Array.isArray(post.ProductTag)
                  ? post.ProductTag.join(", ")
                  : post.ProductTag || "-"}
              </td>
              <td className="border px-4 py-2">
                {Array.isArray(post.ProductBrand)
                  ? post.ProductBrand.join(", ")
                  : post.ProductBrand || "-"}
              </td>
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
              No products found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;