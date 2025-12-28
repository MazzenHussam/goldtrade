import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products"; // This is our single source of truth

export default function Home() {
  // We take only the first 3 items from our data file to show on the Home page
  const featuredProducts = products.slice(0, 3);

  return (
    <main>
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-5 text-center bg-dark text-white">
        <div className="container py-4">
          <h1 className="display-5 fw-bold mb-3">
            Premium <span className="text-gold">Gold Ingots</span>
          </h1>
          <p className="lead opacity-75">
            Certified 24K gold bars with secure delivery.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">
            Featured <span className="text-gold">Gold Ingots</span>
          </h2>
          <div className="row g-4">
            {featuredProducts.map((item) => (
              <div key={item.id} className="col-md-4">
                {/* Spreading the item ensures id, title, weight, and price are passed correctly */}
                <ProductCard {...item} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5">
            <a href="/shop" className="btn btn-outline-gold px-4 py-2">
              View All Products
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}