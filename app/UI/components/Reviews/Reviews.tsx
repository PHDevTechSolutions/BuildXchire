"use client";

import React, { useEffect, useState } from "react";

interface Review {
  id: string | number;
  Name: string;
  Rating: number;
  Comment: string;
}

interface ReviewsProps {
  ProductSku: string;
  ProductName: string;
}

const Reviews: React.FC<ReviewsProps> = ({ ProductSku, ProductName }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [Fullname, setFullname] = useState("");
  const [Rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [Comment, setComment] = useState("");

  // Fetch reviews filtered by ProductSku
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/Backend/Reviews/fetch?sku=${ProductSku}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [ProductSku]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Fullname || !Comment || Rating === 0) {
      alert("Please fill in all fields and select a rating.");
      return;
    }

    const reviewData = { Name: Fullname, Rating, Comment, ProductSku, ProductName };

    try {
      const res = await fetch("/api/Backend/Reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        alert("Review submitted successfully!");
        const newReview: Review = { id: Date.now(), Name: Fullname, Rating, Comment };
        setReviews([newReview, ...reviews]);
        setFullname("");
        setRating(0);
        setHoverRating(0);
        setComment("");
        setShowForm(false);
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting review.");
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.Rating, 0) / reviews.length).toFixed(1)
      : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? "text-yellow-500" : "text-gray-300"}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-12 border-t pt-6">
      <h2 className="text-2xl font-bold mb-2">Product Reviews</h2>
      <p className="mb-4 text-gray-700">Average Rating: {averageRating} / 5</p>

      {/* Existing Reviews */}
      <div className="flex flex-col gap-4 mb-6">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div
              key={`${ProductSku}-${review.id}-${index}`}
              className="border p-4 rounded flex flex-col gap-1"
            >
              <p className="font-semibold">{review.Name}</p>
              <p className="text-yellow-500">{renderStars(review.Rating)}</p>
              <p className="text-gray-700">{review.Comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {/* Show "Create a Review" button first */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 transition mb-4"
        >
          Create a Review
        </button>
      )}

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border p-4 rounded">
          <input
            type="text"
            placeholder="Fullname"
            value={Fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />

          {/* Clickable Stars */}
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => {
              const starValue = i + 1;
              return (
                <span
                  key={i}
                  className={`text-2xl cursor-pointer ${
                    starValue <= (hoverRating || Rating) ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(starValue)}
                >
                  ★
                </span>
              );
            })}
          </div>

          <textarea
            placeholder="Comment"
            value={Comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default Reviews;
