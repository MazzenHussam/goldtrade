"use client";
import { useEffect, useState } from "react";
import { getLiveGoldPrice } from "@/Lib/goldApi";

export default function LiveTicker() {
  const [prices, setPrices] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      const data = await getLiveGoldPrice();
      setPrices(data);
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (!prices) return <div className="bg-dark text-white p-2 text-center small">Loading live market rates...</div>;

  return (
    <div className="bg-dark text-white p-2 d-flex justify-content-center align-items-center gap-4 small border-bottom border-gold">
      <span><strong className="text-gold">LIVE 24K:</strong> {Math.round(prices.gram24k).toLocaleString()} EGP/g</span>
      <span><strong className="text-gold">LIVE 21K:</strong> {Math.round(prices.gram21k).toLocaleString()} EGP/g</span>
      <span className="opacity-50">Last Sync: {prices.lastUpdated}</span>
    </div>
  );
}