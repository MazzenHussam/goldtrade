"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import { CldUploadWidget } from 'next-cloudinary';
import { supabase } from "@/Lib/supabase"; 
import { useRouter } from "next/navigation";
import Link from "next/link"; // Added this for navigation

export default function AdminDashboard() {
  const [inventory, setInventory] = useState([]); 
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({ title: "", weight: "", price: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // AUTH CHECK
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login"); 
      }
    };
    checkUser();
  }, [router]);

  // --- STEP 4: LOGOUT FUNCTION ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); 
  };

  // 1. FETCH from PostgreSQL on page load
  useEffect(() => {
    async function getInventory() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setInventory(data);
      setLoading(false);
    }
    getInventory();
  }, []);

  // 2. INSERT into PostgreSQL
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('products')
      .insert([
        { 
          title: formData.title, 
          weight: parseFloat(formData.weight), 
          price: formData.price, 
          image: imageUrl 
        }
      ])
      .select();

    if (error) {
      alert("Error saving to Postgres: " + error.message);
    } else {
      setInventory([data[0], ...inventory]); 
      setFormData({ title: "", weight: "", price: "" });
      setImageUrl("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // 3. DELETE from PostgreSQL
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Error deleting: " + error.message);
      } else {
        setInventory(inventory.filter((item) => item.id !== id));
      }
    }
  };

  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    return <div className="alert alert-danger m-5 text-center">Cloudinary Config Missing</div>;
  }

  return (
    <main className="bg-light min-vh-100">
      <Navbar />
      <LiveTicker />
      <div className="container py-5">
        
        {/* HEADER WITH UPDATED BUTTONS */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Admin <span className="text-gold">Dashboard</span></h2>
          
          <div className="d-flex gap-2">
            <Link href="/admin/orders" className="btn btn-dark btn-sm fw-bold px-3 shadow-sm">
              View Orders
            </Link>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline-danger btn-sm fw-bold px-3 shadow-sm"
            >
              Logout Securely
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* FORM COLUMN */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-3">Add New Gold Bar</h5>
              {showSuccess && <div className="alert alert-success py-2 small">Saved to Postgres!</div>}
              
              <form onSubmit={handleAddProduct}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Product Title</label>
                  <input type="text" className="form-control" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Weight (Grams)</label>
                  <input type="number" step="0.01" className="form-control" required value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Current Price (EGP)</label>
                  <input type="text" className="form-control" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold d-block">Product Image</label>
                  {imageUrl && <img src={imageUrl} alt="Preview" className="rounded mb-2 w-100 shadow-sm" style={{ height: "150px", objectFit: "cover" }} />}
                  <CldUploadWidget uploadPreset="gold_shop_preset" onSuccess={(res) => setImageUrl(res.info.secure_url)}>
                    {({ open }) => (
                      <button type="button" className="btn btn-outline-dark btn-sm w-100" onClick={() => open()}>
                        {imageUrl ? "Change Photo" : "Upload Photo"}
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
                <button type="submit" className="btn btn-gold w-100 fw-bold py-2">Save Product</button>
              </form>
            </div>
          </div>

          {/* TABLE COLUMN */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th className="ps-4 py-3">Product</th>
                      <th>Weight</th>
                      <th>Price</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" className="text-center py-4">Connecting to Postgres...</td></tr>
                    ) : inventory.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded me-3" style={{ width: "40px", height: "40px", overflow: "hidden" }}>
                              {item.image && <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                            </div>
                            <span className="fw-bold">{item.title}</span>
                          </div>
                        </td>
                        <td>{item.weight}g</td>
                        <td className="text-gold fw-bold">{item.price} EGP</td>
                        <td className="text-end pe-4">
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(item.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}