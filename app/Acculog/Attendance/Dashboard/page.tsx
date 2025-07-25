"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import Chart from "../../components/Chart/ActivityChart";
import Form from "../../components/Activity/Form";
import { ToastContainer, toast } from "react-toastify";
import { IoClose, IoAdd } from "react-icons/io5";

// ⬇️  Dynamically import the map so it only renders on the client
const MapCard = dynamic(() => import("../../components/Chart/MapChart"), {
  ssr: false,
  loading: () => <p className="text-center py-10">Loading map…</p>,
});

export default function DashboardPage() {
  interface FormData {
    ReferenceID: string;
    Email: string;
    Type: string;
    Status: string;
    _id?: string;
    date_created?: string;
  }

  const [userDetails, setUserDetails] = useState({
    UserId: "",
    ReferenceID: "",
    Manager: "",
    TSM: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Role: "",
    Department: "",
    Company: "",
  });

  const [posts, setPosts] = useState<any[]>([]);

  // 🗓 Default date: today only
  const today = new Date();
  const [startDate, setStartDate] = useState(today.toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(today.toISOString().slice(0, 10));

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  const [form, setForm] = useState<FormData>({
    ReferenceID: "",
    Email: "",
    Type: "",
    Status: "",
  });

  const fetchAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ModuleSales/Activity/FetchLog");
      const data = await res.json();
      setPosts(data.data);
    } catch (error) {
      toast.error("Error fetching activity logs.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get("id");
    if (!userId) return;

    (async () => {
      try {
        const res = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
        const data = await res.json();
        setUserDetails({
          UserId: data._id,
          ReferenceID: data.ReferenceID ?? "",
          Manager: data.Manager ?? "",
          TSM: data.TSM ?? "",
          Firstname: data.Firstname ?? "",
          Lastname: data.Lastname ?? "",
          Email: data.Email ?? "",
          Role: data.Role ?? "",
          Department: data.Department ?? "",
          Company: data.Company ?? "",
        });
      } catch {
        /* ignore */
      }
    })();
  }, []);

  // ⏱ Adjusted filter logic to include the entire endDate
  const endDateWithOffset = endDate
    ? new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000)
    : null;

  const filteredAccounts = posts
    .filter((p) => {
      const d = p.date_created ? new Date(p.date_created) : null;

      const inRange =
        (!startDate || (d && d >= new Date(startDate))) &&
        (!endDateWithOffset || (d && d < endDateWithOffset));

      // If HR, skip reference ID check
      const isHR = userDetails.Department === "Human Resources";
      const matchID =
        p.referenceid === userDetails.ReferenceID ||
        p.ReferenceID === userDetails.ReferenceID;

      return inRange && (isHR || matchID);
    })
    .sort((a, b) => +new Date(b.date_created) - +new Date(a.date_created));


  const chartData = Object.entries(
    filteredAccounts.reduce<Record<string, number>>((acc, p) => {
      if (!p.date_created) return acc;
      const key = new Date(p.date_created).toISOString().slice(0, 10);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStartDate(e.target.value);
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEndDate(e.target.value);

  const clearRange = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleFormChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    if (userDetails.ReferenceID && userDetails.Email) {
      setForm((prev) => ({
        ...prev,
        ReferenceID: userDetails.ReferenceID,
        Email: userDetails.Email,
      }));
    }
  }, [userDetails.ReferenceID, userDetails.Email]);

  const openFormWithAnimation = () => {
    setShowForm(true);
    setTimeout(() => setAnimateForm(true), 10);
  };
  const closeFormWithAnimation = () => {
    setAnimateForm(false);
    setTimeout(() => setShowForm(false), 300);
  };

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          {/* 📝 Form Overlay */}
          {showForm && (
            <div
              className={`fixed inset-0 flex items-center justify-center z-[9999] p-4 bg-black bg-opacity-50 transition-opacity duration-300 ${animateForm ? "opacity-100" : "opacity-0"
                }`}
            >
              <Form
                formData={form}
                onChange={handleFormChange}
                userDetails={userDetails}
                fetchAccount={fetchAccount}
                setForm={setForm}
                setShowForm={closeFormWithAnimation}
              />
            </div>
          )}

          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* 📅 Date Range Filter */}
          <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4 sm:items-end text-black">
            <div className="flex flex-col">
              <label htmlFor="startDate" className="text-xs font-medium mb-1">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="border rounded p-2 text-xs"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="endDate" className="text-xs font-medium mb-1">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="border rounded p-2 text-xs"
              />
            </div>
            <button
              onClick={clearRange}
              className="bg-gray-100 hover:bg-gray-200 border rounded p-2 text-xs whitespace-nowrap flex"
            >
              <IoClose size={15} /> Clear range
            </button>
            <button
              onClick={openFormWithAnimation}
              aria-label="Add Activity"
              title="Add Activity"
              className="bg-green-700 hover:bg-green-800 text-white shadow-md rounded p-2 text-xs whitespace-nowrap flex"
            >
              <IoAdd size={15} />Create Activity
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-6 text-black">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Activities Over Time
            </h2>
            <Chart data={chartData} />
          </div>

          <MapCard posts={filteredAccounts} />
        </div>

        {/* 📱 Floating Button for Mobile */}
        <button
          onClick={openFormWithAnimation}
          aria-label="Add Activity"
          title="Add Activity"
          className="fixed bottom-10 right-10 shadow-xl bg-green-700 hover:bg-gray-800 text-white rounded-full text-xl flex items-center justify-center z-[10000] md:hidden"
          style={{ width: "60px", height: "60px", padding: 0 }}
        >
          +
        </button>

        <ToastContainer className="text-xs" autoClose={1000} />
      </ParentLayout>
    </SessionChecker>
  );
}
