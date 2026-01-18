"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/Lib/supabase"; 
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems, updateQty, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const totalPrice = cartItems?.reduce((acc, item) => {
    const priceValue = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/,/g, '')) 
      : item.price;
    return acc + (priceValue * (item.qty || 1));
  }, 0) || 0;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          customer_address: form.address,
          total_amount: totalPrice.toString(),
          items: cartItems, 
        }])
        .select();

      if (error) throw error;
      setOrderId(data[0].id);
      clearCart();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="container py-5 text-center mt-5">
        <div className="card border-0 shadow-sm p-5 mx-auto" style={{maxWidth: '500px'}}>
          <div className="mb-4"><span className="display-1 text-success">✓</span></div>
          <h1 className="fw-bold">Order Confirmed!</h1>
          <p className="text-muted">Thank you for choosing Gold Trade. Your order ID is <strong>#{orderId}</strong>.</p>
          <Link href="/" className="btn btn-gold w-100 mt-3">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-light" style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <Navbar />
      <div className="container py-4 pb-5"> {/* Added pb-5 for mobile spacing */}
        <div className="row g-4">
          
          {/* LEFT: FORM */}
          <div className="col-lg-7 order-2 order-lg-1">
            <div className="card border-0 shadow-sm p-4 rounded-4">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Delivery Details</h5>
              <form onSubmit={handleCheckout}>
                <div className="mb-3">
                  <label className="form-label small text-uppercase fw-bold text-muted">Full Name</label>
                  <input type="text" className="form-control form-control-lg bg-light border-0" required onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-uppercase fw-bold text-muted">Email</label>
                    <input type="email" className="form-control form-control-lg bg-light border-0" required onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-uppercase fw-bold text-muted">Phone</label>
                    <input type="tel" className="form-control form-control-lg bg-light border-0" required onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label small text-uppercase fw-bold text-muted">Address</label>
                  <textarea className="form-control bg-light border-0" rows="3" required placeholder="Building, Street, Area..." onChange={e => setForm({...form, address: e.target.value})}></textarea>
                </div>
                
                <button type="submit" disabled={loading || cartItems.length === 0} className="btn btn-gold btn-lg w-100 fw-bold py-3 shadow-sm rounded-3">
                  {loading ? "Processing..." : `Complete Purchase - ${totalPrice.toLocaleString()} EGP`}
                </button>
              </form>
            </div>
          </div>
          
          {/* RIGHT: ORDER SUMMARY */}
          <div className="col-lg-5 order-1 order-lg-2">
            <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Your Order</h5>
              <div className="cart-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex align-items-center mb-4 pb-3 border-bottom border-light">
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.title}</h6>
                      <p className="text-muted small mb-2">{item.price} EGP / per unit</p>
                      
                      {/* QTY CONTROLS */}
                      <div className="d-flex align-items-center bg-light rounded-pill px-2 py-1" style={{ width: 'fit-content' }}>
                        <button className="btn btn-sm btn-link text-dark p-0 px-2" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                        <span className="mx-2 small fw-bold">{item.qty}</span>
                        <button className="btn btn-sm btn-link text-dark p-0 px-2" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="fw-bold mb-1">{(parseFloat(item.price.replace(/,/g, '')) * item.qty).toLocaleString()} EGP</p>
                      <button className="btn btn-sm text-danger small p-0" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-bold">{totalPrice.toLocaleString()} EGP</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2 fs-5">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold text-gold">{totalPrice.toLocaleString()} EGP</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}