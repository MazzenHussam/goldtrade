"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/Lib/supabase"; // Import the client we created earlier

export default function Home() {
  // 1. Initialize state as an empty array
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Postgres query: Get the 3 newest products
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (err) {
        console.error("Error fetching from Postgres:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main>
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-5 text-center bg-dark text-white">
        <div className="container py-4">
          <h1 className="display-5 fw-bold mb-3">
            Premium <span className="text-gold">Gold Ingots</span>
          </h1>
          <p className="lead opacity-75">
            Certified 24K gold bars with secure delivery.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">
            Featured <span className="text-gold">Gold Ingots</span>
          </h2>
          
          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-gold" role="status"></div>
                <p className="mt-2">Loading live inventory from Postgres...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((item) => (
                <div key={item.id} className="col-md-4">
                  <ProductCard {...item} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted">No products found in the database.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}