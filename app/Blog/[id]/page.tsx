"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Header from "../../UI/components/Header/Header";
import Footer from "../../UI/components/Footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import { LuShare2 } from "react-icons/lu";
import "react-toastify/dist/ReactToastify.css";

interface Post {
  _id: string;
  PostTitle: string;
  PostDescription: string;
  PostStatus: string;
  Author: string;
  FeaturedImage?: string;
}

// Clean WordPress HTML (keep <p>, <h2>, <h3>, <img>)
const cleanPostContent = (html: string) => {
  if (!html) return "";
  return html.replace(/<!-- wp:[^>]+-->/g, "").replace(/<!-- \/wp:[^>]+-->/g, "");
};

const BlogPostPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const userId = searchParams?.get("id") || "";

  const [post, setPost] = useState<Post | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all posts and select the clicked one
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Backend/Posts/fetch?id=all`);
        const json = await res.json();
        const posts: Post[] = json.data || [];
        setAllPosts(posts);

        // Select post based on clicked id
        const selected = posts.find((p) => p._id === id);
        if (selected) setPost(selected);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch blog post.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPosts();
  }, [id]);

  if (loading) return <p>Loading blog post...</p>;
  if (!post) return <p>Blog post not found.</p>;

  // Share functionality
  const handleShare = () => {
    const shareData = {
      title: post?.PostTitle,
      text: `Check out this blog post: ${post?.PostTitle}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(shareData.url || "").then(() => {
        toast.success("Link copied to clipboard!");
      });
    }
  };

  // Related posts
  const relatedPosts = allPosts.filter((p) => p._id !== post._id).slice(0, 4);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{post.PostTitle}</h1>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <LuShare2 size={18} /> Share
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Author: <strong>{post.Author}</strong> | Status: <strong>{post.PostStatus}</strong>
        </p>

        {post.FeaturedImage && (
          <img
            src={post.FeaturedImage}
            alt={post.PostTitle}
            className="w-full max-h-[400px] object-cover rounded mb-6"
          />
        )}

        <div
          className="prose max-w-full"
          dangerouslySetInnerHTML={{ __html: cleanPostContent(post.PostDescription) }}
        />

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
            <div className="flex flex-col gap-4">
              {relatedPosts.map((p) => (
                <div
                  key={p._id}
                  className="border p-4 rounded shadow hover:shadow-lg cursor-pointer flex flex-col md:flex-row gap-4"
                  onClick={() => router.push(`/Blog/${p._id}?id=${userId}`)} // Pass UserId here
                >
                  {p.FeaturedImage && (
                    <img
                      src={p.FeaturedImage}
                      alt={p.PostTitle}
                      className="w-32 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{p.PostTitle}</h3>
                    <p className="text-gray-700 text-sm">
                      {p.PostDescription
                        .replace(/<!-- wp:[^>]+-->/g, "")
                        .replace(/<\/?[^>]+(>|$)/g, "")
                        .slice(0, 150)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default BlogPostPage;
