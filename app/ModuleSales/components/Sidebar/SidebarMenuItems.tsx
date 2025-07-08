// Icons
import { CiMemoPad, CiCircleInfo, } from "react-icons/ci";
import { SlChart } from "react-icons/sl";
import { IoHelp } from "react-icons/io5";
import { BsBuildings } from "react-icons/bs";

const getMenuItems = (userId: string | null = "") => [
    //{
        //title: "Customer Database",
        //icon: BsBuildings,
        //subItems: [
            //{ 
                //title: "Active", 
                //description: "Regular Client", 
                //href: `/ModuleSales/Sales/Companies/Active${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "New Client", 
                //description: "Outbound / CSR Endorsement / Client Dev", 
                //href: `/ModuleSales/Sales/Companies/NewClient${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "Non-Buying", 
                //description: "Existing Client / Continous Quote / No SO", 
                //href: `/ModuleSales/Sales/Companies/NonBuying${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "Inactive", 
                //description: "Order 6 Months Ago - Last Purchased", 
                //href: `/ModuleSales/Sales/Companies/Inactive${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "Group / Affiliate", 
                //description: "Grouped or Affiliated Companies", 
                //href: `/ModuleSales/Sales/Companies/Group${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "For Deletion Companies", 
                //description: "Companies to be Deleted", 
                //href: `/ModuleSales/Sales/Companies/Deletion${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "Client History", 
                //description: "Past Client Interactions", 
                //href: `/ModuleSales/Sales/Companies/History${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
        //],
    //},
    {
        title: "Activities",
        icon: CiMemoPad,
        subItems: [
            { 
                title: "Scheduled Task", 
                description: "Upcoming Tasks and Reminders", 
                href: `/ModuleSales/Sales/Activity/Scheduled${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            //{ 
                //title: "Client Coverage Guide", 
                //description: "Client Management Overview", 
                //href: `/ModuleSales/Sales/Activity/CCG${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
        ],
    },
    //{//
        //title: "Reports",
        //icon: SlChart,
        //subItems: [
            //{ 
                //title: "Account Management", 
                //description: "Manage Client Accounts", 
                //href: `/ModuleSales/Sales/Reports/Account${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "Quotation Summary", 
                //description: "Summary of Quotations", 
                //href: `/ModuleSales/Sales/Reports/Quotation${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "SO Summary", 
                //description: "Sales Order Overview", 
                //href: `/ModuleSales/Sales/Reports/SO${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "Pending SO", 
                //description: "Outstanding Sales Orders", 
                //href: `/ModuleSales/Sales/Reports/PendingSO${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "CSR Inquiry Summary", 
                //description: "Customer Service Inquiries", 
                //href: `/ModuleSales/Sales/Reports/CSR${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "SPF Summary", 
                //description: "Special Pricing Form Breakdown",
                //href: `/ModuleSales/Sales/Reports/SPF${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
            //{ 
                //title: "New Client Summary", 
                //description: "Recently Onboarded Clients", 
                //href: `/ModuleSales/Sales/Reports/NewClient${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
        //],
    //},
    //{
        //title: "Help Center",
        //icon: IoHelp,
        //subItems: [
            //{ 
                //title: "Tutorials", 
                //href: `/ModuleSales/Sales/HelpCenter/Tutorials${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
        //],
    //},
    //{
        //title: "What is Fluxx?",
        //icon: CiCircleInfo,
        //subItems: [
            //{ 
                //title: "View Information", 
                //href: `/ModuleSales/Sales/Information${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            //},
        //],
    //},
];

export default getMenuItems;
