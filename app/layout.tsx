// layout.tsx (server component)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import SessionProviderWrapper from "./sessionProviderWrapper";

const inter = Inter({
  weight: "100",
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fluxx",
  description: "Created in NextJs Developed By Fluxx Tech Solutions",
  icons: {
    icon: "/fluxx-tech-solutions-logo-no-circle.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ToastContainer />
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
