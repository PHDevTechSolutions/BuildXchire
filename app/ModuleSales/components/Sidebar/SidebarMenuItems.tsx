// Icons
import { CiMemoPad } from "react-icons/ci";

const getMenuItems = (userId: string | null = "") => [
  {
    title: "Activities",
    icon: CiMemoPad,
    subItems: [
      {
        title: "Activity Logs",
        description: "View your recent activity records and task updates",
        href: `/ModuleSales/Sales/Activity/ActivityLogs${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
      },
      {
        title: "Session Logs",
        description: "Review your session history and related reminders",
        href: `/ModuleSales/Sales/Activity/SessionLogs${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
      },
    ],
  },
];

export default getMenuItems;
