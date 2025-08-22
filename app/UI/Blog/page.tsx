"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../UI/components/Header/Header";
import Footer from "../../UI/components/Footer/Footer";

interface Post {
  _id: string;
  PostTitle: string;
  PostDescription: string;
  PostStatus: string;
  Author: string;
  FeaturedImage?: string;
}

interface UserDetails {
  UserId: string;
  ReferenceID: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  Role: string;
}

// Clean WordPress content to remove block comments
const cleanPostContent = (html: string) => {
  if (!html) return "";
  return html.replace(/<!-- wp:[^>]+-->/g, "").replace(/<!-- \/wp:[^>]+-->/g, "");
};

// Strip HTML for preview and limit characters
const formatDescription = (html: string, limit = 300) => {
  const clean = cleanPostContent(html);
  const tmp = document.createElement("DIV");
  tmp.innerHTML = clean;
  const text = tmp.textContent || tmp.innerText || "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const refId = "all"; // fetch all posts

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const fetchPosts = async (refId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/Backend/Posts/fetch?id=${refId}`);
      const json = await res.json();
      setPosts(json.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user info if logged in
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
      } catch (err) {
        toast.error("Failed to fetch user data.");
      }
    })();
  }, []);

  useEffect(() => {
    fetchPosts(refId);
  }, [refId]);

  if (loading) return <p className="text-center py-10">Loading posts...</p>;

  // Pagination calculation
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Blog</h1>

        {posts.length === 0 ? (
          <p className="text-center py-10">No posts available.</p>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {currentPosts.map((post) => {
                const userQuery = userDetails ? `?id=${userDetails.UserId}` : "";
                return (
                  <div
                    key={post._id}
                    className="border p-4 md:p-6 rounded shadow hover:shadow-lg transition flex flex-col md:flex-row gap-4"
                  >
                    {post.FeaturedImage && (
                      <img
                        src={post.FeaturedImage}
                        alt={post.PostTitle}
                        className="w-full md:w-80 h-48 md:h-50 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">{post.PostTitle}</h2>
                      <p className="text-gray-700 mb-2">
                        {formatDescription(post.PostDescription, 300)}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        Status: <strong>{post.PostStatus}</strong> | Author:{" "}
                        <strong>{post.Author}</strong>
                      </p>
                      <Link
                        href={`/Blog/${post._id}${userQuery}`}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center mt-8 gap-2">
                <button
                  className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    className={`px-3 py-1 border rounded hover:bg-gray-200 ${
                      currentPage === num ? "bg-gray-300 font-bold" : ""
                    }`}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </button>
                ))}

                <button
                  className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
