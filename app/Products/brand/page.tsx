"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../UI/components/Header/Header";
import Footer from "../../UI/components/Footer/Footer";
import Image from "next/image";
import { LuShoppingCart, LuView } from "react-icons/lu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Brand {
  _id: string;
  BrandName: string;
  Thumbnail?: string;
}

interface Product {
  ProductName: string;
  ProductImage?: string;
  ProductBrand: string[]; 
  ProductCategory?: string[] | string;
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

const ProductsByBrand: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const BrandName = searchParams?.get("brand") || "";

  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCart, setLoadingCart] = useState<Record<string, boolean>>({});
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  // Fetch user details to get ReferenceID
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

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/Backend/Brand/fetch?id=all");
        const json = await res.json();
        setBrands(json.data || []);
      } catch (err) {
        toast.error("Failed to fetch brands.");
      }
    };
    fetchBrands();
  }, []);

  // Fetch products by brand
  useEffect(() => {
    if (!BrandName) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/Backend/Products/fetch?id=all`);
        const json = await res.json();

        const matchedProducts = (json.data || []).filter(
          (p: Product) => Array.isArray(p.ProductBrand) && p.ProductBrand.includes(BrandName)
        );

        setProducts(matchedProducts);
      } catch (err) {
        toast.error("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, [BrandName]);

  // Navigate to product page with userId in query
  const handleProductClick = (sku: string) => {
    router.push(`/Products/${sku}?id=${userDetails?.UserId}`);
  };

  // Add to cart with ReferenceID
  const handleAddToCart = async (product: Product) => {
    if (!userDetails) {
      toast.error("User not loaded.");
      return;
    }

    setLoadingCart((prev) => ({ ...prev, [product.ProductSku]: true }));

    const cartItem = {
      CartNumber: "CART-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      ProductName: product.ProductName,
      ProductSKU: product.ProductSku,
      ProductImage: product.ProductImage || "",
      ProductPrice: Number(product.ProductSalePrice || product.ProductPrice),
      Quantity: 1,
      ReferenceID: userDetails.ReferenceID, // <-- ReferenceID used here
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
      toast.error("Error adding to cart.", { autoClose: 2000 });
    } finally {
      setLoadingCart((prev) => ({ ...prev, [product.ProductSku]: false }));
    }
  };

  const brandExists = brands.some((b) => b.BrandName === BrandName);

  if (!brandExists) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-10">
          <p className="text-gray-500">Brand "{BrandName}" not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-4">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push(`/UI?id=${userDetails?.UserId}`)}
          >
            Home
          </span>{" "}
          / <span className="font-semibold text-gray-800">{BrandName}</span>
        </nav>

        <h1 className="text-2xl font-bold mb-6">Products by {BrandName}</h1>

        <div className="columns-2 md:columns-4 gap-6 mt-4 space-y-6">
          {products.map((product) => (
            <div
              key={product.ProductSku}
              className="bg-white rounded-xl shadow-lg overflow-hidden break-inside-avoid hover:scale-[1.02] hover:shadow-2xl transition"
            >
              {/* Image */}
              <div
                className="relative w-full cursor-pointer"
                onClick={() => handleProductClick(product.ProductSku)}
              >
                <Image
                  src={product.ProductImage || "/placeholder.png"}
                  alt={product.ProductName}
                  width={800}
                  height={1000}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-sm">{product.ProductName}</h3>

                {/* Categories */}
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

                {/* Price */}
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

                {/* Short description */}
                <div
                  className="text-xs text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: product.ProductShortDescription
                      ? String(product.ProductShortDescription)
                      : "<p>No description available.</p>",
                  }}
                />

                {/* Buttons: Add to Cart, View Product */}
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingCart[product.ProductSku]}
                    className={`w-full flex items-center justify-center gap-2 rounded bg-blue-600 text-white py-2 px-3 hover:bg-blue-500 transition text-sm ${loadingCart[product.ProductSku] ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {loadingCart[product.ProductSku] ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <LuShoppingCart className="text-sm" />
                    )}
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
      </main>
      <Footer />
    </div>
  );
};

export default ProductsByBrand;
