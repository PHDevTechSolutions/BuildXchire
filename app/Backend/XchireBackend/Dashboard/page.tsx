"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import { ToastContainer, toast } from "react-toastify";

export default function DashboardPage() {
  const [userDetails, setUserDetails] = useState({
    UserId: "",
    ReferenceID: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Role: "",
  });

  const [posts, setPosts] = useState<any[]>([]); // Replace 'any' with your Post type if defined
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

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


  const filteredAccounts = posts
    .filter((p) => {
     
      const referenceMatch =
        p.referenceid === userDetails.ReferenceID ||
        p.ReferenceID === userDetails.ReferenceID;

      const roleMatch =
        userDetails.Role === "Admin" || userDetails.Role === "Guest";

      return referenceMatch && roleMatch;
    })

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
        </div>

        <ToastContainer className="text-xs" autoClose={1000} />
      </ParentLayout>
    </SessionChecker>
  );
}
