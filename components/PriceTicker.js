export default function PriceTicker() {
  const rates = [
    { karat: "24K", buy: "4,050", sell: "4,020" },
    { karat: "21K", buy: "3,544", sell: "3,510" },
    { karat: "18K", buy: "3,037", sell: "3,010" },
    { karat: "USD/EGP", buy: "48.50", sell: "48.30" },
  ];

  return (
    <div className="bg-dark text-white py-1 overflow-hidden position-relative border-bottom border-secondary">
      <div className="d-flex ticker-track">
        {/* We repeat the items to create a seamless loop */}
        {[...rates, ...rates].map((item, index) => (
          <div key={index} className="d-inline-block px-4 border-end border-secondary">
            <small className="text-gold fw-bold">{item.karat}: </small>
            <small className="mx-2">Buy: {item.buy}</small>
            <small className="text-muted">|</small>
            <small className="mx-2">Sell: {item.sell}</small>
          </div>
        ))}
      </div>
    </div>
  );
}