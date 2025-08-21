"use client";

import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Products from "./components/Products/Product";
import Brand from "./components/Section/Brand/Brand";
import "react-toastify/dist/ReactToastify.css";

interface Brand {
  _id: string;          // Use _id from your DB
  BrandName: string;
  Thumbnail: string;
}

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-10">{children}</main>
  );
};

const UI: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />

      <Container>
        {/* Brands Section */}
        <Brand />
        {/* Products Component */}
        <Products />
      </Container>

      <Footer />
    </div>
  );
};

export default UI;
