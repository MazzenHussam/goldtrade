"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabase";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShopData() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('weight', { ascending: true });

      if (!error) {
        setAllProducts(data);
        setFilteredProducts(data);
      }
      setLoading(false);
    }
    fetchShopData();
  }, []);

  // Filter Logic (Search + Weight Sidebar)
  useEffect(() => {
    let results = allProducts;

    if (searchTerm) {
      results = results.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedWeight !== "All") {
      results = results.filter(p => p.weight === parseFloat(selectedWeight));
    }

    setFilteredProducts(results);
  }, [searchTerm, selectedWeight, allProducts]);

  return (
    <main className="bg-light min-vh-100">
      <Navbar />
      
      <div className="container py-5">
        <div className="row g-4">
          
          {/* LEFT SIDEBAR - The Classic Look */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: "100px", zIndex: 10 }}>
              <h5 className="fw-bold mb-4">Filters</h5>
              
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase text-muted">Search</label>
                <input 
                  type="text" className="form-control" placeholder="e.g. BTC..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase text-muted">Weight</label>
                <select className="form-select" onChange={(e) => setSelectedWeight(e.target.value)}>
                  <option value="All">All Weights</option>
                  <option value="1">1 Gram</option>
                  <option value="5">5 Grams</option>
                  <option value="10">10 Grams</option>
                  <option value="20">20 Grams</option>
                  <option value="31.1">1 Ounce</option>
                  <option value="50">50 Grams</option>
                </select>
              </div>

              <button 
                className="btn btn-outline-gold w-100 btn-sm"
                onClick={() => {setSearchTerm(""); setSelectedWeight("All");}}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* RIGHT GRID - Product Display */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold m-0">Gold <span className="text-gold">Catalog</span></h2>
              <span className="text-muted small">{filteredProducts.length} Products Found</span>
            </div>

            <div className="row g-4">
              {loading ? (
                <div className="col-12 text-center py-5">
                  <div className="spinner-border text-gold"></div>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="col-md-6 col-xl-4">
                    <ProductCard {...product} />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5 bg-white rounded shadow-sm">
                  <p className="text-muted mb-0">No items match your criteria.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}