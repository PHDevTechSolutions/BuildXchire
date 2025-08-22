"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../UI/components/Header/Header";
import Footer from "../../UI/components/Footer/Footer";
import { LuShare2, LuShoppingCart } from "react-icons/lu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  ProductName: string;
  ProductImage: string;
  ProductCategory?: string[]; // multiple categories
  ProductPrice: number | string;
  ProductSalePrice?: number | string;
  ProductSku: string;
  ProductDescription?: string;
}

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryName = searchParams?.get("category") || null;

  const [products, setProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
  const [loadingCart, setLoadingCart] = useState<{ [key: string]: boolean }>({});

  const generateCartNumber = () => "CART-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

  const handleSubmit = async (product: Product) => {
    setLoadingCart((prev) => ({ ...prev, [product.ProductSku]: true }));
    const qty = quantity[product.ProductSku] || 1;

    const cartItem = {
      CartNumber: generateCartNumber(),
      ProductName: product.ProductName,
      ProductSKU: product.ProductSku,
      ProductImage: product.ProductImage,
      ProductPrice: Number(product.ProductSalePrice || product.ProductPrice) * qty,
      Quantity: qty,
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

  useEffect(() => {
    if (!categoryName) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/Backend/Products/fetch?id=all`);
        const json = await res.json();
        setProducts(
          (json.data || []).filter(
            (p: Product) =>
              Array.isArray(p.ProductCategory) &&
              p.ProductCategory.includes(categoryName)
          )
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const handleProductClick = (sku: string) => {
    router.push(`/Products/${sku}`);
  };

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-4 flex flex-wrap gap-1">
          <span className="cursor-pointer hover:underline" onClick={() => router.push("/")}>
            Home
          </span>
          {categoryName && (
            <>
              /{" "}
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push(`/products?category=${categoryName}`)}
              >
                {categoryName}
              </span>
            </>
          )}
        </nav>

        <h1 className="text-2xl font-bold mb-6">
          {categoryName ? `${categoryName} Products` : "Category not found"}
        </h1>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.ProductSku}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-105 hover:shadow-2xl transition"
              >
                <div
                  className="relative w-full aspect-[4/5] cursor-pointer"
                  onClick={() => handleProductClick(product.ProductSku)}
                >
                  <Image
                    src={product.ProductImage}
                    alt={product.ProductName}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <button className="absolute top-2 right-2 bg-white/80 p-1 rounded-full">
                    <LuShare2 />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-sm">{product.ProductName}</h3>

                  {/* Category Badges */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.ProductCategory?.map((cat, idx) => (
                      <span
                        key={idx}
                        className="inline-block text-xs bg-blue-500 text-white px-2 py-0.5 rounded"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2">
                    {product.ProductSalePrice ? (
                      <>
                        <span className="line-through text-red-500 text-xs">
                          ₱{Number(product.ProductPrice).toFixed(2)}
                        </span>
                        <span className="ml-2 font-semibold text-green-600">
                          ₱{Number(product.ProductSalePrice).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        ₱{Number(product.ProductPrice).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Quantity + Add to Cart */}
                  <div className="mt-4 flex gap-2 items-center">
                    <input
                      type="number"
                      min={1}
                      value={quantity[product.ProductSku] || 1}
                      onChange={(e) =>
                        setQuantity((prev) => ({
                          ...prev,
                          [product.ProductSku]: Number(e.target.value),
                        }))
                      }
                      className="w-16 border rounded px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => handleSubmit(product)}
                      disabled={loadingCart[product.ProductSku]}
                      className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition text-sm ${
                        loadingCart[product.ProductSku] ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      {loadingCart[product.ProductSku] ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <LuShoppingCart className="text-sm" />
                      )}
                      <span>
                        {loadingCart[product.ProductSku] ? "Adding..." : "Add to Cart"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found in this category.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CategoryPage;
