"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import Chart from "../../components/Chart/ActivityChart";
import { ToastContainer, toast } from "react-toastify";

const MapCard = dynamic(
  () => import("../../components/MapCard"),   // ← tiyaking tama ang relative path
  { ssr: false, loading: () => <p className="text-center py-10">Loading map…</p> }
);

export default function DashboardPage() {
  /* --------------- state --------------- */
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  /* --------------- fetch logs --------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/ModuleSales/Activity/FetchLog");
        const data = await res.json();
        setPosts(data.data);
      } catch (e) {
        toast.error("Error fetching activity logs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* --------------- fetch user --------------- */
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

  /* --------------- filter + chart data --------------- */
  const filteredAccounts = posts
    .filter((p) => {
      const d = p.date_created ? new Date(p.date_created) : null;
      const inRange =
        (!startDate || (d && d >= new Date(startDate))) &&
        (!endDate || (d && d <= new Date(endDate)));
      const matchID =
        p.referenceid === userDetails.ReferenceID ||
        p.ReferenceID === userDetails.ReferenceID;
      return inRange && matchID;
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

  /* --------------- render --------------- */
  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Activities Over Time
            </h2>
            <Chart data={chartData} />
          </div>

          {/* Map only in browser */}
          <MapCard posts={filteredAccounts} />
        </div>
        <ToastContainer className="text-xs" autoClose={1000} />
      </ParentLayout>
    </SessionChecker>
  );
}
