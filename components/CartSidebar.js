"use client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation"; // Changed from Link

export default function CartSidebar() {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter(); // Initialize the router

  const total = cartItems.reduce((acc, item) => {
    const priceValue = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/,/g, '')) 
      : item.price;
    return acc + (priceValue * item.qty);
  }, 0);

  // MANUALLY HANDLE NAVIGATION
  const handleCheckoutNavigation = () => {
    // 1. Find the Bootstrap offcanvas instance and hide it manually
    const cartEl = document.getElementById('cartSidebar');
    const bootstrap = require('bootstrap'); 
    const modal = bootstrap.Offcanvas.getInstance(cartEl);
    
    if (modal) {
      modal.hide();
    }

    // 2. Navigate to checkout
    router.push("/checkout");
  };

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="cartSidebar">
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title fw-bold">Your Gold Cart</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      
      <div className="offcanvas-body">
        {cartItems.length === 0 ? (
          <p className="text-center text-muted">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
              <div>
                <h6 className="mb-0 fw-bold">{item.title}</h6>
                <small className="text-muted">{item.qty} x {item.price} EGP</small>
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>×</button>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-top">
        <div className="d-flex justify-content-between mb-3">
          <span className="fw-bold">Total:</span>
          <span className="text-gold fw-bold">{total.toLocaleString()} EGP</span>
        </div>
        
        {/* WE USE ONCLICK NOW INSTEAD OF HREF */}
        <button 
          onClick={handleCheckoutNavigation}
          disabled={cartItems.length === 0}
          className="btn btn-gold w-100 py-2 fw-bold"
        >
          Checkout Securely
        </button>
      </div>
    </div>
  );
}