"use client";
import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // Assuming this is your cart logic

export default function ProductCard({ id, title, weight, price, image }) {
  const { addToCart } = useCart();
  const fallbackImage = "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=400";

  return (
    <div className="card h-100 border-0 shadow-sm hover-shadow transition">
      <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
        <img 
          src={image || fallbackImage} 
          className="card-img-top h-100 w-100" 
          alt={title}
          style={{ objectFit: "cover" }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-dark text-gold shadow-sm">{weight}g</span>
        </div>
      </div>
      
      <div className="card-body text-center">
        <h5 className="card-title fw-bold mb-1">{title}</h5>
        <p className="text-gold fw-bold mb-3">{price} EGP</p>
        
        <div className="d-grid gap-2">
          {/* VIEW DETAILS BUTTON */}
          <Link href={`/shop/${id}`} className="btn btn-outline-dark fw-bold">
            View Details
          </Link>
          
          {/* ADD TO CART BUTTON */}
          <button 
            onClick={() => addToCart({ id, title, price, image, weight })}
            className="btn btn-gold fw-bold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}