import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    if (user) {
      try {
        const res = await api.get(`/cart/${user.userId}`);
        setCart(res.data);
        setCartCount(res.data.length);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    } else {
      setCart([]);
      setCartCount(0);
    }
  }, [user]);

  // Add an item to cart
  const addItem = async (productId, quantity = 1) => {
  if (!user) return;

  // Debug alerts
  alert(`User ID: ${user.userId}`);
  alert(`Product ID: ${productId}`);
  alert(`Quantity: ${quantity}`);

  try {
    // Send as query params to match your Spring Boot endpoint
    await api.post("/cart", null, {
      params: { userId: user.userId, productId, quantity },
    });

    // Fetch updated cart
    await fetchCart();
  } catch (err) {
    console.error("Error adding item to cart:", err);
    throw err;
  }
};

  // Remove an item from cart
  const removeItem = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      await fetchCart();
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};
