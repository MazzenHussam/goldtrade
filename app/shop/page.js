import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products"; // This is our single source of truth

export default function ShopPage() {
  // REMOVED: The local "const products" array. 
  // We now use the imported "products" from your data folder.

  return (
    <main>
      <Navbar />
      <div className="container py-5">
        <div className="row">
          
          {/* SIDEBAR FILTERS */}
          <aside className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm p-3">
              <h5 className="fw-bold mb-3">Filters</h5>
              
              <div className="mb-4">
                <p className="fw-bold small text-uppercase">Brands</p>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="btc" /> 
                  <label className="form-check-label" htmlFor="btc">BTC</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="dahab" /> 
                  <label className="form-check-label" htmlFor="dahab">Dahab Masr</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="sam" /> 
                  <label className="form-check-label" htmlFor="sam">SAM</label>
                </div>
              </div>

              <div className="mb-4">
                <p className="fw-bold small text-uppercase">Weight (Grams)</p>
                <select className="form-select form-select-sm">
                  <option>All Weights</option>
                  <option>1g</option>
                  <option>5g</option>
                  <option>10g</option>
                  <option>31.1g (1oz)</option>
                </select>
              </div>

              <button className="btn btn-gold btn-sm w-100">Apply Filters</button>
            </div>
          </aside>

          {/* MAIN PRODUCT GRID */}
          <section className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold">Gold Ingots</h4>
              <span className="text-muted small">{products.length} Products found</span>
            </div>

            <div className="row g-4">
              {products.map((item) => (
                <div key={item.id} className="col-md-6 col-xl-4">
                  {/* We use {...item} to pass all properties (id, title, weight, price) at once */}
                  <ProductCard {...item} />
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}