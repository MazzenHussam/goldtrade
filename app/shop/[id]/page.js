"use client";

import React, { use } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products"; // Import the single source of truth

export default function ProductDetail({ params }) {
  // Unwrap the params promise
  const resolvedParams = use(params);
  const id = resolvedParams?.id;
  const { addToCart } = useCart();

  // Find the actual product data from our central file using the ID from the URL
  const product = id ? products.find((p) => String(p.id) === String(id)): null;

  // Fallback in case the user types a wrong ID in the URL
  if (!product) {
    return (
      <main>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-gold mb-3" role="status"></div>
          <h3>Finding your gold...</h3>
          <p className="text-muted">If this takes too long, the product might not exist.</p>
          <a href="/shop" className="btn btn-outline-dark mt-3">Back to Shop</a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="container py-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/shop" className="text-decoration-none text-muted">Shop</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Product Image Area */}
          <div className="col-md-6">
            <div 
              className="bg-light rounded d-flex align-items-center justify-content-center shadow-sm" 
              style={{ minHeight: '400px', border: '1px solid #eee' }}
            >
              <span className="text-muted">High Quality Gold Image Placeholder</span>
            </div>
          </div>

          {/* Product Info Area */}
          <div className="col-md-6">
            <h1 className="fw-bold mb-2">{product.title}</h1>
            <p className="text-muted mb-4">Product Code: DM-GOLD-{product.id}00</p>
            
            <div className="card bg-light border-0 mb-4 shadow-sm">
              <div className="card-body">
                <h3 className="text-gold fw-bold mb-0">{product.price} EGP</h3>
                <small className="text-muted">* Price updated 2 minutes ago</small>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold text-uppercase small">Specifications:</h6>
              <table className="table table-sm mt-2">
                <tbody>
                  <tr><td className="text-muted">Weight:</td><td>{product.weight} Grams</td></tr>
                  <tr><td className="text-muted">Purity:</td><td>{product.purity || "24K (999.9)"}</td></tr>
                  <tr><td className="text-muted">Brand:</td><td>Official Mint</td></tr>
                  <tr><td className="text-muted">Tax/Fees:</td><td>Calculated at checkout</td></tr>
                </tbody>
              </table>
            </div>

            <div className="d-grid gap-2">
              <button 
                className="btn btn-gold btn-lg py-3 fw-bold" 
                onClick={() => {
                   console.log("Cart Sync - Adding Item:", product);
                   addToCart(product);
                }}
              >
                Add to Cart
              </button>
              <button className="btn btn-outline-dark py-2">
                Check Store Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}