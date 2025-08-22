"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LuView, LuShoppingCart } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Filters from "../../components/Tools/Filters";
import SidebarMenu from "./SidebarMenu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  ProductName: string;
  ProductImage: string;
  ProductCategory?: string;
  ProductPrice: number | string;
  ProductSalePrice?: number | string;
  ProductSku: string;
  ProductShortDescription?: string;
}

interface UserDetails {
  UserId: string;
  ReferenceID: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  Role: string;
}

const Products: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showSidebar, setShowSidebar] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [loadingCart, setLoadingCart] = useState<{ [sku: string]: boolean }>({});
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  // Fetch user details from URL id
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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/Backend/Products/fetch?id=all`);
        const json = await res.json();
        setProducts(json.data || []);

        const prices = json.data.map((p: Product) => Number(p.ProductSalePrice || p.ProductPrice));
        const max = Math.max(...prices, 10000);
        setMaxPrice(max);
        setPriceRange([0, max]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const tags = ["All", ...Array.from(new Set(products.map((p) => p.ProductCategory || "Uncategorized")))];

  const filteredProducts = products
    .filter((p) => (filterTag === "All" ? true : (p.ProductCategory || "Uncategorized") === filterTag))
    .filter((p) => p.ProductName.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      const price = Number(p.ProductSalePrice || p.ProductPrice);
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      const priceA = Number(a.ProductSalePrice || a.ProductPrice);
      const priceB = Number(b.ProductSalePrice || b.ProductPrice);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });

  const generateCartNumber = () => "CART-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

  const handleAddToCart = async (product: Product) => {
    if (!userDetails) {
      toast.info("Please login first to add to cart.");
      router.push("/UserLogin/Login");
      return;
    }

    setLoadingCart((prev) => ({ ...prev, [product.ProductSku]: true }));

    const cartItem = {
      CartNumber: generateCartNumber(),
      ProductName: product.ProductName,
      ProductSKU: product.ProductSku,
      ProductImage: product.ProductImage,
      ProductPrice: Number(product.ProductSalePrice || product.ProductPrice),
      Quantity: 1,
      ReferenceID: userDetails.ReferenceID, // <-- Include ReferenceID
    };

    try {
      const res = await fetch("/api/Backend/Cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });

      if (res.ok) toast.success("Product added to cart!", { autoClose: 2000 });
      else toast.error("Failed to add to cart.", { autoClose: 2000 });
    } catch (err) {
      console.error(err);
      toast.error("Error adding to cart.", { autoClose: 2000 });
    } finally {
      setLoadingCart((prev) => ({ ...prev, [product.ProductSku]: false }));
    }
  };

  const handleProductClick = (sku: string) => {
    const url = userDetails
      ? `/Products/${sku}?id=${userDetails.UserId}` // <-- Include UserId
      : `/Products/${sku}`;
    router.push(url);
  };

  return (
    <div className="flex gap-4">
      {showSidebar && (
        <SidebarMenu
          tags={tags}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          maxPrice={maxPrice}
          handlePriceChange={(e, index) => {
            const value = Number(e.target.value);
            setPriceRange((prev) => (index === 0 ? [value, prev[1]] : [prev[0], value]));
          }}
          setShowSidebar={setShowSidebar}
        />
      )}

      <div className="flex-grow">
        <Filters
          search={search}
          setSearch={setSearch}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          tags={tags}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        <div className="columns-2 md:columns-4 gap-6 mt-4 space-y-6">
          {filteredProducts.map((product) => (
            <div
              key={product.ProductSku}
              className="bg-white rounded-xl shadow-lg overflow-hidden break-inside-avoid hover:scale-[1.02] hover:shadow-2xl transition"
            >
              <div
                className="relative w-full cursor-pointer"
                onClick={() => handleProductClick(product.ProductSku)}
              >
                <Image
                  src={product.ProductImage}
                  alt={product.ProductName}
                  width={800}
                  height={1000}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-sm">{product.ProductName}</h3>

                <div className="flex flex-wrap gap-2">
                  {(
                    Array.isArray(product.ProductCategory)
                      ? product.ProductCategory
                      : String(product.ProductCategory || "Uncategorized").split(",")
                  )
                    .filter((cat) => cat.trim() !== "")
                    .map((cat, idx) => (
                      <span
                        key={idx}
                        className="inline-block text-xs bg-black text-white px-2 py-0.5 rounded-full"
                      >
                        {cat.trim()}
                      </span>
                    ))}
                </div>

                <div className="mt-2">
                  {product.ProductSalePrice ? (
                    <>
                      <span className="line-through text-red-500 text-xs">
                        ₱{Number(product.ProductPrice).toFixed(2)}
                      </span>
                      <span className="ml-1 font-semibold text-green-600">
                        ₱{Number(product.ProductSalePrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      ₱{Number(product.ProductPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                <div
                  className="text-xs text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: product.ProductShortDescription
                      ? String(product.ProductShortDescription)
                      : "<p>No description available.</p>",
                  }}
                />

                <div className="flex flex-col md:flex-row gap-2 mt-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingCart[product.ProductSku]}
                    className={`w-full flex items-center justify-center gap-2 rounded bg-blue-600 text-white py-2 px-3 hover:bg-blue-500 transition text-sm ${loadingCart[product.ProductSku] ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {loadingCart[product.ProductSku] ? <span className="animate-spin">⏳</span> : <LuShoppingCart className="text-sm" />}
                    <span>{loadingCart[product.ProductSku] ? "Adding..." : "Add to Cart"}</span>
                  </button>

                  <button
                    onClick={() => handleProductClick(product.ProductSku)}
                    className="w-full flex items-center justify-center gap-2 rounded bg-gray-200 text-gray-900 py-2 px-3 hover:bg-gray-300 transition text-sm"
                  >
                    <LuView className="text-sm" /> View Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
