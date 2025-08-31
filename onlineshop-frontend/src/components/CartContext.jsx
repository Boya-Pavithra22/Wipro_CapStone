import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart items from backend
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      setCartCount(0);
      return;
    }

    try {
      const res = await api.get(`/cart/${user.userId}`);
      setCart(res.data);
      setCartCount(res.data.length);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }, [user]);

  // Add item to cart
  const addItem = async (productId, quantity = 1) => {
    if (!user) return;
    try {
      await api.post("/cart", null, {
        params: { userId: user.userId, productId, quantity },
      });
      await fetchCart();
    } catch (err) {
      console.error("Error adding item to cart:", err);
      throw err;
    }
  };

  // Remove a single item from cart
  const removeItem = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      // Update state after deletion
      setCart((prevCart) => prevCart.filter((item) => item.id !== cartId));
      setCartCount((prevCount) => prevCount - 1);
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    if (!cart || cart.length === 0) return;
    try {
      for (let item of cart) {
        await api.delete(`/cart/${item.id}`);
      }
      setCart([]);
      setCartCount(0);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, fetchCart, addItem, removeItem, clearCart, setCart, setCartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
