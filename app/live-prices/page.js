import Navbar from "@/components/Navbar";

export default function LivePrices() {
  const prices = [
    { caliber: "24K Gold", buy: "4,050", sell: "4,020", change: "+12" },
    { caliber: "22K Gold", buy: "3,712", sell: "3,680", change: "+10" },
    { caliber: "21K Gold", buy: "3,544", sell: "3,510", change: "+8" },
    { caliber: "18K Gold", buy: "3,037", sell: "3,010", change: "+5" },
    { caliber: "Silver (999)", buy: "52", sell: "48", change: "-1" },
  ];

  return (
    <main>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Market <span className="text-gold">Live Prices</span></h2>
          <p className="text-muted">Prices are updated every 60 seconds based on global market rates.</p>
        </div>

        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th className="py-3 ps-4">Type</th>
                  <th className="py-3">Buy Price (EGP)</th>
                  <th className="py-3">Sell Price (EGP)</th>
                  <th className="py-3">Change</th>
                  <th className="py-3 pe-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p, index) => (
                  <tr key={index}>
                    <td className="ps-4 fw-bold">{p.caliber}</td>
                    <td className="text-success fw-bold">{p.buy}</td>
                    <td className="text-danger fw-bold">{p.sell}</td>
                    <td>
                      <span className={`badge ${p.change.includes('+') ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {p.change} EGP
                      </span>
                    </td>
                    <td className="text-center pe-4">
                      <button className="btn btn-sm btn-gold">Trade</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-light rounded text-center small text-muted">
          All prices exclude VAT and craftsmanship fees. Last Sync: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </main>
  );
}