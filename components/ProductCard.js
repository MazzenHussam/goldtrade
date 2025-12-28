
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';


export default function ProductCard({ id,title, weight, price, image }) {
  const { addToCart } = useCart();
  return (
    <div className="card h-100 shadow-sm border-0 transition-hover">
      <div className="p-3 text-center bg-light">
        {/* Replace with real image later, using a placeholder for now */}
        <div style={{ position: 'relative', height: '180px', width: '100%' }}>
           <div className="bg-secondary-subtle w-100 h-100 d-flex align-items-center justify-content-center rounded text-muted">
             Gold Ingot Image
           </div>
        </div>
      </div>
      <div className="card-body text-center">
        <h6 className="card-title fw-bold mb-1">{title}</h6>
        <p className="text-muted small mb-2">{weight} Grams - 24K</p>
        <h5 className="text-gold fw-bold mb-3">{price} EGP</h5>
        <button className="btn btn-gold w-100" onClick={() => addToCart({ id, title, weight, price })}>
  Add to Cart
</button>
        <Link href={`/shop/${id}`} className="btn btn-gold w-100">
          View Details
        </Link>
      </div>
    </div>
  );
}