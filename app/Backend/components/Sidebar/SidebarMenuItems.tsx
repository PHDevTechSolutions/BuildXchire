// Icons
import { MdPostAdd } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { PiPackageDuotone } from "react-icons/pi";

// Build link with optional user ID
const buildHref = (basePath: string, userId?: string | null) =>
  `${basePath}${userId ? `?id=${encodeURIComponent(userId)}` : ""}`;

// Generate full menu regardless of role
const getMenuItems = (userId: string | null = "") => {
  const menu = [];

  // POSTS section
  menu.push({
    title: "Posts",
    icon: MdPostAdd,
    subItems: [
      {
        title: "All Posts",
        description: "View all your published and draft posts",
        href: buildHref("/Backend/XchireBackend/Posts", userId),
      },
      {
        title: "Categories",
        description: "Browse or manage post categories",
        href: buildHref("/posts/categories", userId),
      },
      {
        title: "Tags",
        description: "Manage tags used across your posts",
        href: buildHref("/posts/tags", userId),
      },
    ],
  });

  // PAGES section
  menu.push({
    title: "Pages",
    icon: HiOutlineDocumentText,
    subItems: [
      {
        title: "All Pages",
        description: "View and edit your published pages",
        href: buildHref("/pages", userId),
      },
    ],
  });

  // PRODUCTS section
  menu.push({
    title: "Products",
    icon: PiPackageDuotone,
    subItems: [
      {
        title: "All Products",
        description: "Manage your store’s product listings",
        href: buildHref("/Backend/XchireBackend/Products", userId),
      },
      {
        title: "Brands",
        description: "Organize products by brand",
        href: buildHref("/Backend/XchireBackend/Brand", userId),
      },
      {
        title: "Categories",
        description: "Categorize your products for easier browsing",
        href: buildHref("/Backend/XchireBackend/Categories", userId),
      },
      {
        title: "Tags",
        description: "Apply tags to products for search and filtering",
        href: buildHref("/Backend/XchireBackend/Tags", userId),
      },
    ],
  });

  return menu;
};

export default getMenuItems;
