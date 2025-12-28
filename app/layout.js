"use client"; // Required for Bootstrap's JS to load
import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import PriceTicker from "@/components/PriceTicker";
import { CartProvider } from "@/context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  // This hook loads Bootstrap's JavaScript (for dropdowns, mobile menu, etc.)
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="en">
      <body className={geistSans.variable}>
      <CartProvider>
          <PriceTicker />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}