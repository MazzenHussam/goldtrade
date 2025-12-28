"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { products as initialProducts } from "@/data/products";
import LiveTicker from "@/components/LiveTicker";
import { CldUploadWidget } from 'next-cloudinary';

export default function AdminDashboard() {
  const [inventory, setInventory] = useState(initialProducts);
  const [imageUrl, setImageUrl] = useState(""); // Stores the uploaded image link
  const [formData, setFormData] = useState({ title: "", weight: "", price: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  // Function to Add Product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: String(Date.now()), // Using timestamp for a truly unique ID
      ...formData,
      image: imageUrl || null, // Adds the uploaded image to the product
    };
    
    setInventory([...inventory, newProduct]);
    setFormData({ title: "", weight: "", price: "" }); // Reset text fields
    setImageUrl(""); // Reset image preview
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Function to Delete Product
  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // This filters the list and keeps everything EXCEPT the item with the matching ID
      setInventory(inventory.filter((item) => item.id !== id));
    }
  };

  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    return (
      <div className="alert alert-danger m-5">
        <strong>Setup Required:</strong> Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your .env.local file.
      </div>
    );
  }
  
  return (
    <main className="bg-light min-vh-100">
      <Navbar />
      <LiveTicker />
      <div className="container py-5">
        <h2 className="fw-bold mb-4">Admin <span className="text-gold">Dashboard</span></h2>

        <div className="row g-4">
          {/* FORM COLUMN */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-3">Add New Gold Bar</h5>
              {showSuccess && <div className="alert alert-success py-2 small">Product added successfully!</div>}
              
              <form onSubmit={handleAddProduct}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Product Title</label>
                  <input 
                    type="text" className="form-control" placeholder="e.g. 20g BTC Bar" required 
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Weight (Grams)</label>
                  <input 
                    type="number" className="form-control" placeholder="20" required 
                    value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Current Price (EGP)</label>
                  <input 
                    type="text" className="form-control" placeholder="85,000" required 
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>

                {/* IMAGE UPLOAD SECTION */}
                <div className="mb-4">
                  <label className="form-label small fw-bold d-block">Product Image</label>
                  {imageUrl && (
                    <div className="mb-2">
                      <img src={imageUrl} alt="Upload Preview" className="rounded shadow-sm" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                    </div>
                  )}
                  <CldUploadWidget 
                    uploadPreset="gold_shop_preset" 
                    onSuccess={(result) => setImageUrl(result.info.secure_url)}
                  >
                    {({ open }) => (
                      <button type="button" className="btn btn-outline-dark btn-sm w-100" onClick={() => open()}>
                        {imageUrl ? "Replace Photo" : "Upload Photo"}
                      </button>
                    )}
                  </CldUploadWidget>
                </div>

                <button type="submit" className="btn btn-gold w-100 fw-bold py-2">Add to Inventory</button>
              </form>
            </div>
          </div>

          {/* TABLE COLUMN */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm overflow-hidden">
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
                    {inventory.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded me-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", overflow: "hidden" }}>
                              {item.image ? (
                                <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <small className="text-muted">No img</small>
                              )}
                            </div>
                            <span className="fw-bold">{item.title}</span>
                          </div>
                        </td>
                        <td>{item.weight}g</td>
                        <td className="text-gold fw-bold">{item.price} EGP</td>
                        <td className="text-end pe-4">
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteProduct(item.id)}
                          >
                            Delete
                          </button>
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