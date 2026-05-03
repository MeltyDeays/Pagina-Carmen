import { useState } from 'react';

export function useCartController() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        alert('Esta prenda ya está en tu carrito.');
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    cart,
    isCartOpen,
    addToCart,
    removeFromCart,
    toggleCart,
    totalAmount,
    setCart,
    setIsCartOpen
  };
}
