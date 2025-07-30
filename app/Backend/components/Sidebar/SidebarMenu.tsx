import React from "react";
import Link from "next/link";
// Icons
import { RxCaretDown, RxCaretLeft } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";

interface SubItem {
  title: string;
  href: string;
  description?: string;
}

interface MenuItem {
  title: string;
  icon: any;
  subItems: SubItem[];
}

interface SidebarMenuProps {
  collapsed: boolean;
  openSections: Record<string, boolean>;
  handleToggle: (title: string) => void;
  menuItems: MenuItem[];
  userId: string | null;
  pendingInquiryCount?: number;
  pendingInactiveCount?: number;
  pendingDeleteCount?: number;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  collapsed,
  openSections,
  handleToggle,
  menuItems,
  userId,
  pendingInquiryCount = 0,
  pendingInactiveCount = 0,
  pendingDeleteCount = 0,
}) => {
  const myProfileItem = {
    title: "My Profile",
    icon: CiSettings,
    subItems: [
      {
        title: "Update Profile",
        href: `/Backend/XchireBackend/Account/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ""}`
      },
    ],
  };

  return (
    <div className="flex flex-col items-center flex-grow overflow-y-auto text-xs p-2">
      <div className="w-full">
        <button
          onClick={() => handleToggle(myProfileItem.title)}
          className={`flex items-center w-full p-4 hover:bg-lime-700 rounded hover:text-white text-white transition-all duration-300 ease-in-out hover:shadow-md active:scale-95 ${collapsed ? "justify-center" : ""
            }`}
        >
          <myProfileItem.icon size={18} />
          {!collapsed && <span className="ml-2">{myProfileItem.title}</span>}
          {!collapsed && (
            <span className="ml-auto">
              {openSections[myProfileItem.title] ? <RxCaretDown size={15} /> : <RxCaretLeft size={15} />}
            </span>
          )}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out text-gray-900 ${openSections[myProfileItem.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          {openSections[myProfileItem.title] && !collapsed && (
            <div>
              {myProfileItem.subItems.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  href={subItem.href}
                  className="flex items-center w-full p-4 bg-gray-200 hover:bg-lime-800 hover:text-white transition-all duration-300 ease-in-out"
                >
                  <FaRegCircle size={10} className="mr-2 ml-2" />
                  {subItem.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full mt-1">
        <Link
          href={`/Backend/XchireBackend/Dashboard/${userId ? `?id=${encodeURIComponent(userId)}` : ""}`}
          className="flex items-center w-full p-4 bg-lime-700 hover:bg-lime-800 mb-1 text-white rounded-md transition-all duration-300 ease-in-out hover:shadow-md active:scale-95"
        >
          <span className="mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 3h4v4H3V3zm5 0h4v4H8V3zm5 0h4v4h-4V3zM3 8h4v4H3V8zm5 0h4v4H8V8zm5 0h4v4h-4V8zM3 13h4v4H3v-4zm5 0h4v4H8v-4zm5 0h4v4h-4v-4z" />
            </svg>
          </span>
          Dashboard
        </Link>
      </div>

      {menuItems
        .filter((item) => item.title !== "My Profile")
        .map((item, index) => (
          <div key={index} className="w-full">
            <button
              onClick={() => handleToggle(item.title)}
              className={`flex items-center w-full p-4 hover:bg-lime-800 rounded hover:text-white text-white transition-all duration-300 ease-in-out hover:shadow-md active:scale-95 ${collapsed ? "justify-center" : ""
                }`}
            >
              <item.icon size={18} />
              {!collapsed && <span className="ml-2">{item.title}</span>}
              {!collapsed && (
                <span className="ml-auto">
                  {openSections[item.title] ? <RxCaretDown size={15} /> : <RxCaretLeft size={15} />}
                </span>
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out text-gray-900 ${openSections[item.title] ? "max-h-200 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              {item.subItems.map((subItem, subIndex) => (
                <div key={subIndex} className="w-full">
                  <Link
                    href={subItem.href}
                    className="flex flex-col mb-1 p-4 bg-gray-200 hover:bg-lime-800 hover:text-white transition-all duration-300 ease-in-out rounded"
                  >
                    <div className="flex items-center">
                      <FaRegCircle size={10} className="mr-2" />
                      <span className="text-[11px]">{subItem.title}</span>
                    </div>

                    {subItem.description && (
                      <p className="mt-1 text-[10px]">
                        {subItem.description}
                      </p>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default SidebarMenu;
