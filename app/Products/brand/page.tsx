"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../UI/components/Header/Header";
import Footer from "../../UI/components/Footer/Footer";
import Image from "next/image";
import { LuShare2 } from "react-icons/lu";
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
  ProductBrand: string[]; // <-- array of strings now
  ProductPrice: number | string;
  ProductSalePrice?: number | string;
  ProductSku: string;
  ProductDescription?: string;
}

const ProductsByBrand: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const BrandName = searchParams?.get("brand") || "";

  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

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

  // Fetch products and match with BrandName
  useEffect(() => {
    if (!BrandName) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/Backend/Products/fetch?id=all`);
        const json = await res.json();

        // Only products whose ProductBrand array contains the selected BrandName
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

  const handleProductClick = (sku: string) => {
    router.push(`/Products/${sku}`);
  };

  const handleAddToCart = async (product: Product) => {
    const cartItem = {
      CartNumber: "CART-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      ProductName: product.ProductName,
      ProductSKU: product.ProductSku,
      ProductImage: product.ProductImage || "",
      ProductPrice: Number(product.ProductSalePrice || product.ProductPrice),
      Quantity: 1,
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
    }
  };

  // Optionally, check if brand exists in brand table
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
            onClick={() => router.push("/")}
          >
            Home
          </span>{" "}
          / <span className="font-semibold text-gray-800">{BrandName}</span>
        </nav>

        <h1 className="text-2xl font-bold mb-6">Products by {BrandName}</h1>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.ProductSku}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-105 hover:shadow-2xl transition"
              >
                <div
                  className="relative w-full h-48 cursor-pointer"
                  onClick={() => handleProductClick(product.ProductSku)}
                >
                  <Image
                    src={product.ProductImage || "/no-image.png"}
                    alt={product.ProductName}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <button className="absolute top-2 right-2 bg-white/80 p-1 rounded-full">
                    <LuShare2 />
                  </button>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-bold text-sm">{product.ProductName}</h3>
                  <span className="inline-block text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                    {product.ProductBrand.join(", ")}
                  </span>
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
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-2 bg-blue-600 text-white py-1.5 px-3 rounded hover:bg-blue-500 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found for {BrandName}.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductsByBrand;
