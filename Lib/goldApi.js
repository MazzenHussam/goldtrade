// lib/goldApi.js

export async function getLiveGoldPrice() {
  try {
    // 1. Fetch Global Gold Price (Price per Ounce in USD)
    // Using a reliable free endpoint for gold prices
    const response = await fetch('https://api.gold-api.com/price/XAU');
    const data = await response.json();
    
    // 2. Define the USD to EGP rate (In a real app, you'd fetch this too)
    const usdToEgp = 50.0; 
    
    // 3. Convert Ounce to Grams (1 Ounce = 31.1035 Grams)
    const pricePerGramUsd = data.price / 31.1035;
    
    // 4. Final Price in EGP
    const pricePerGramEgp = pricePerGramUsd * usdToEgp;

    return {
      gram24k: pricePerGramEgp,
      gram21k: pricePerGramEgp * 0.875, // 21k calculation
      lastUpdated: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.error("Price Fetch Error:", error);
    return null;
  }
}