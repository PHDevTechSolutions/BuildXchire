"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Products from "./components/Products/Product";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-10">{children}</main>
  );
};

const UI: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />

      <Container>
        <Products />
      </Container>

      <Footer />
    </div>
  );
};

export default UI;
