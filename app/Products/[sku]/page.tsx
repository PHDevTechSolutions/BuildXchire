"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LuShare2 } from "react-icons/lu";
import Header from "../../UI/components/Header/Header";
import Footer from "../../UI/components/Footer/Footer";
import LeftColumn from "./Columns/Left";
import RightColumn from "./Columns/Right";
import Reviews from "../../UI/components/Reviews/Reviews";
import RelatedProducts from "../../UI/components/Related/RelatedProducts";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  ProductName: string;
  ProductImage: string;
  ProductGallery?: string[];
  CategoryName: string;
  ProductPrice: number | string;
  ProductSalePrice?: number | string;
  ProductSku: string;
  ProductDescription?: string;
  ProductShortDescription: string;
  ProductBrand?: string;
}

const ProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  if (!params?.sku) return <p>Invalid product.</p>;

  const sku = Array.isArray(params.sku) ? params.sku[0] : params.sku;
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [galleryStart, setGalleryStart] = useState<number>(0);
  const visibleThumbnails = 4;
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/Backend/Products/fetch?id=all`);
        const json = await res.json();
        const products: Product[] = json.data || [];
        setAllProducts(products);

        // select current product
        const selected = products.find((p) => p.ProductSku === sku);
        if (selected) {
          const gallery: string[] = selected.ProductGallery ? [...selected.ProductGallery] : [];
          if (!gallery.includes(selected.ProductImage)) {
            gallery.unshift(selected.ProductImage);
          }
          setProduct({ ...selected, ProductGallery: gallery });
          setMainImage(selected.ProductImage);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [sku]);

  if (!product) return <p>Loading product...</p>;

  const gallery = product.ProductGallery || [];

  const scrollLeft = () => setGalleryStart((prev) => Math.max(prev - 1, 0));
  const scrollRight = () =>
    setGalleryStart((prev) => Math.min(prev + 1, Math.max(0, gallery.length - visibleThumbnails)));

  const generateCartNumber = () => "CART-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

  const handleSubmit = async () => {
    if (!product) return;

    const cartItem = {
      CartNumber: generateCartNumber(),
      ProductName: product.ProductName,
      ProductSKU: product.ProductSku,
      ProductImage: product.ProductImage,
      ProductPrice: Number(product.ProductPrice) * quantity,
      Quantity: quantity,
    };

    try {
      const res = await fetch("/api/Backend/Cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });

      if (res.ok) {
        toast.success("Product added to cart!", { autoClose: 2000 });
        setTimeout(() => router.push("./cart"), 1500);
      } else {
        toast.error("Failed to add to cart.", { autoClose: 2000 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding to cart.", { autoClose: 2000 });
    }
  };

  const handleQrAddToCart = async () => {
    if (!product) return;

    const cartItem = {
      CartNumber: generateCartNumber(),
      ProductName: product.ProductName,
      ProductSKU: product.ProductSku,
      ProductImage: product.ProductImage,
      ProductPrice: Number(product.ProductPrice),
      Quantity: 1,
    };

    try {
      const res = await fetch("/api/Backend/Cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });

      if (res.ok) {
        toast.success("Product added to cart via QR!", { autoClose: 2000 });
        setTimeout(() => router.push("./cart"), 1500);
      } else {
        toast.error("Failed to add via QR.", { autoClose: 2000 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding via QR.", { autoClose: 2000 });
    }
  };

  const qrValue = JSON.stringify({
    ProductSKU: product.ProductSku,
    ProductName: product.ProductName,
    Quantity: 1,
  });

  const handleProductClick = (clickedSku: string) => {
    router.push(`/products/${clickedSku}`);
  };

  // Related products: same category, exclude current, max 4
  const relatedProducts = allProducts
    .filter((p) => p.CategoryName === product.CategoryName && p.ProductSku !== product.ProductSku)
    .slice(0, 4);

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6">
        <LeftColumn
          product={product}
          mainImage={mainImage}
          setMainImage={setMainImage}
          gallery={gallery}
          galleryStart={galleryStart}
          visibleThumbnails={visibleThumbnails}
          scrollLeft={scrollLeft}
          scrollRight={scrollRight}
        />

        <RightColumn
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          handleSubmit={handleSubmit}
          qrValue={qrValue}
          handleQrAddToCart={handleQrAddToCart}
        />
      </div>

      {/* Reviews */}
      <Reviews ProductSku={product.ProductSku} ProductName={product.ProductName} />
      {/* Related / Recommended Products */}
      <RelatedProducts
        relatedProducts={relatedProducts}
        handleProductClick={handleProductClick}
      />

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Footer />
    </>
  );
};

export default ProductPage;
