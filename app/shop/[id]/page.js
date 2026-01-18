"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/Lib/supabase";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

export default function ProductDetails() {
  const { id } = useParams(); // Get ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      // Postgres Query: SELECT * FROM products WHERE id = [id] LIMIT 1
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id) 
        .single(); // We only want one item

      if (!error) {
        setProduct(data);
      }
      setLoading(false);
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-5">Loading Gold Details...</div>;
  if (!product) return <div className="text-center py-5">Product not found.</div>;

  return (
    <main className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-5">
        <div className="row g-5">
          {/* Image Column */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm p-3">
              <img 
                src={product.image || "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=400"} 
                alt={product.title} 
                className="img-fluid rounded shadow-sm"
              />
            </div>
          </div>

          {/* Details Column */}
          <div className="col-md-6">
            <h1 className="fw-bold mb-3">{product.title}</h1>
            <div className="d-flex align-items-center mb-4">
              <span className="badge bg-dark text-gold p-2 px-3 fs-6 me-3">{product.weight} Grams</span>
              <span className="text-muted">Serial Number: DB-{product.id}</span>
            </div>
            
            <h3 className="text-gold fw-bold mb-4">{product.price} EGP</h3>
            
            <p className="text-secondary mb-5">
              This certified 24K gold bar is produced with the highest standards. 
              Each ingot comes with a certificate of authenticity and secure packaging. 
              Live market pricing ensures you get the best value.
            </p>

            <button 
              onClick={() => addToCart(product)}
              className="btn btn-gold btn-lg w-100 fw-bold py-3 shadow-sm"
            >
              Add to Shopping Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}