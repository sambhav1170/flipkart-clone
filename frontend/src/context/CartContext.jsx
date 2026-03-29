import React, { createContext, useState, useEffect } from 'react';
import { fetchCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart } from '../api/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const response = await fetchCart();
      if (response.success) {
        setCartItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

    const addToCart = async (productId, quantity = 1) => {
    if (!localStorage.getItem('token')) {
      alert("Please login to add items to cart!");
      return false;
    }
    try {
      const response = await apiAddToCart(productId, quantity);
      if (response.success) {
        await loadCart();
        return true;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || "Failed to add to cart");
    }
    return false;
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await apiRemoveFromCart(productId);
      if (response.success) {
        await loadCart();
        return true;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
    return false;
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, loading, loadCart, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
