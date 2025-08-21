"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LuShare2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Filters from "../../components/Tools/Filters";
import SidebarMenu from "./SidebarMenu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  ProductName: string;
  ProductImage: string;
  CategoryName: string;
  ProductPrice: number | string;
  ProductSalePrice?: number | string;
  ProductSku: string;
  ProductDescription?: string;
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/Backend/Products/fetch?id=all`);
        const json = await res.json();
        setProducts(json.data || []);

        const prices = json.data.map((p: Product) =>
          Number(p.ProductSalePrice || p.ProductPrice)
        );
        const max = Math.max(...prices, 10000);
        setMaxPrice(max);
        setPriceRange([0, max]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const tags = ["All", ...Array.from(new Set(products.map((p) => p.CategoryName)))];

  const filteredProducts = products
    .filter((p) => (filterTag === "All" ? true : p.CategoryName === filterTag))
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

  const handleProductClick = (sku: string) => {
    router.push(`/Products/${sku}`);
  };

  const generateCartNumber = () => "CART-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

  const handleAddToCart = async (product: Product) => {
    const cartItem = {
      CartNumber: generateCartNumber(),
      ProductName: product.ProductName,
      ProductSKU: product.ProductSku,
      ProductImage: product.ProductImage,
      ProductPrice: Number(product.ProductSalePrice || product.ProductPrice),
      Quantity: 1,
    };

    try {
      const res = await fetch("/api/Backend/Cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });

      if (res.ok) {
        toast.success("Product added to cart!", { autoClose: 2000 });
      } else {
        toast.error("Failed to add to cart.", { autoClose: 2000 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding to cart.", { autoClose: 2000 });
    }
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
            setPriceRange((prev) =>
              index === 0 ? [value, prev[1]] : [prev[0], value]
            );
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          {filteredProducts.map((product) => (
            <div
              key={product.ProductSku}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-105 hover:shadow-2xl transition"
            >
              <div className="relative w-full h-48 cursor-pointer" onClick={() => handleProductClick(product.ProductSku)}>
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

              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-sm">{product.ProductName}</h3>
                <span className="inline-block text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                  {product.CategoryName}
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

                {/* Add to Cart Button */}
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
      </div>
    </div>
  );
};

export default Products;
