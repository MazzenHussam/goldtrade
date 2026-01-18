"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("gold_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart error", e);
      }
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("gold_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.id) === String(product.id));
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(product.id) ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  // --- THIS IS THE MISSING PIECE FOR THE BUTTONS ---
  const updateQty = (id, newQty) => {
    if (newQty < 1) {
      removeFromCart(id); // If qty goes to 0, remove the item
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, qty: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("gold_cart");
  };

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQty, // Exported for the checkout page
    clearCart
  }), [cartItems]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);