"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
// Components
import UsersTable from "../../../components/Task/ClientCoverageGuide/UsersTable";
import SearchFilters from "../../../components/Task/ClientCoverageGuide/SearchFilters";
import FuturisticSpinner from "../../../components/Spinner/FuturisticSpinner";
// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClientType, setSelectedClientType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Manager: "", TSM: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [postsLoading, setPostsLoading] = useState<boolean>(true);
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const params = new URLSearchParams(window.location.search);
            const userId = params.get("id");

            if (userId) {
                try {
                    const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
                    if (!response.ok) throw new Error("Failed to fetch user data");
                    const data = await response.json();
                    setUserDetails({
                        UserId: data._id,
                        ReferenceID: data.ReferenceID || "",
                        Manager: data.Manager || "",
                        TSM: data.TSM || "",
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Role: data.Role || "",
                        Department: data.Department || "",
                        Company: data.Company || "",
                    });
                } catch (err: unknown) {
                    console.error("Error fetching user data:", err);
                    setError("Failed to load user data. Please try again later.");
                } finally {
                    setShowSpinner(false);
                }
            } else {
                setError("User ID is missing.");
                setShowSpinner(false);
            }
        };

        fetchUserData();
    }, []);

    const fetchAccount = async () => {
        setPostsLoading(true);
        try {
            const response = await fetch("/api/ModuleSales/Task/Callback/FetchProgress");
            const data = await response.json();
            console.log("Fetched data:", data);
            setPosts(data.data);
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        } finally {
            setPostsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    if (postsLoading || showSpinner) {
        return (
            <SessionChecker>
                <ParentLayout>
                    <FuturisticSpinner setShowSpinner={setShowSpinner} />
                </ParentLayout>
            </SessionChecker>
        );
    }

    const filteredAccounts = Array.isArray(posts)
        ? posts
            .filter((post) => {
                const hasCompanyName = !!post?.companyname;

                const matchesSearchTerm =
                    hasCompanyName &&
                    post.companyname.toLowerCase().includes(searchTerm.toLowerCase());

                const postDate = post.date_created ? new Date(post.date_created) : null;
                const isWithinDateRange =
                    (!startDate || (postDate && postDate >= new Date(startDate))) &&
                    (!endDate || (postDate && postDate <= new Date(endDate)));

                const matchesClientType = selectedClientType
                    ? post?.typeclient === selectedClientType
                    : true;

                const userReferenceID = userDetails.ReferenceID;

                const isSuperOrSpecial =
                    userDetails.Role === "Super Admin" ||
                    userDetails.Role === "Special Access";

                const allowedRoles = [
                    "Super Admin",
                    "Special Access",
                    "Territory Sales Associate",
                    "Guest",
                    "Territory Sales Manager",
                ];

                const matchesRole = allowedRoles.includes(userDetails.Role);

                const matchesReferenceID = isSuperOrSpecial
                    ? true
                    : post?.referenceid === userReferenceID || post?.ReferenceID === userReferenceID;

                return (
                    hasCompanyName &&
                    matchesSearchTerm &&
                    isWithinDateRange &&
                    matchesClientType &&
                    matchesReferenceID &&
                    matchesRole
                );
            })
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
        : [];


    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                {showForm ? (
                                    <></>
                                ) : (
                                    <>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Client Coverage Guide</h2>
                                            <p className="text-xs text-gray-600 mb-4">
                                                The <strong>Client Coverage Guide</strong> provides a comprehensive overview of all transaction histories for each company. It serves as a detailed record of discussions and agreements made with clients, helping to track important conversations, updates, and transactions. By reviewing this guide, users can quickly access relevant information about each client, ensuring efficient management of customer relations and providing a reliable reference for future interactions.
                                            </p>
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                            />
                                            <UsersTable
                                                posts={filteredAccounts}
                                            />
                                        </div>
                                    </>
                                )}

                                <ToastContainer className="text-xs" autoClose={1000} />
                            </div>
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ListofUser;
