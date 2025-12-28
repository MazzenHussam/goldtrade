"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // 1. Initialize state as empty array
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 2. Load data once on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("gold_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart parse error");
      }
    }
    setIsInitialized(true); // Mark as ready
  }, []);

  // 3. Save to storage only AFTER initialization and when cart changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("gold_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const addToCart = (product) => {
    // Ensure product ID is a string to prevent "1" vs 1 bugs
    const productId = String(product.id);

    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.id) === productId);

      if (existing) {
        // Increment quantity if ID matches
        return prev.map((item) =>
          String(item.id) === productId
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      // Add new item if ID is unique
      return [...prev, { ...product, id: productId, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);