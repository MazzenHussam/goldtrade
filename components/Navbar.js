"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from "@/context/CartContext";
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const { cartItems } = useCart();
  const [itemCount, setItemCount] = useState(0);

  // We update the count inside an effect, but we do it safely
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.qty, 0);
    setItemCount(total);
  }, [cartItems]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-gold" href="/">
            GOLD <span className="text-white">TRADE</span>
          </Link>

          <div className="d-flex align-items-center order-lg-last ms-2">
            <button 
              className="btn btn-outline-gold position-relative border-gold text-gold" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#cartSidebar"
              style={{ border: '1px solid #D4AF37' }}
            >
              <span className="me-1">🛒</span>
              
              {/* This is the BADGE SPAN */}
              {itemCount > 0 && (
                <span 
                  suppressHydrationWarning
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {itemCount}
                </span>
              )}
            </button>

            <button className="navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item"><Link className="nav-link" href="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/shop">Shop Ingots</Link></li>
              <li className="nav-item"><Link className="nav-link text-gold" href="/live-prices">Live Prices</Link></li>
              <li className="nav-item">
                <Link className="nav-link btn btn-gold btn-sm ms-lg-3 px-4 text-white" href="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <CartSidebar />
    </>
  );
}