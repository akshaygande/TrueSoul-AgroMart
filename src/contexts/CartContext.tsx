import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartContextType, Product } from '../types';
import { productService } from '../services/productService';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          // Validate that it's an array of cart items
          if (Array.isArray(parsedCart)) {
            setItems(parsedCart);
            console.log('🛒 Cart loaded from localStorage:', parsedCart.length, 'items');
          } else {
            console.warn('Invalid cart data in localStorage, clearing...');
            localStorage.removeItem('cart');
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      } finally {
        setIsLoaded(true);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
        console.log('🛒 Cart saved to localStorage:', items.length, 'items');
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isLoaded]);

  const addToCart = async (product: Product, quantity: number) => {
    setError(null);
    setSuccess(null);
    if (quantity < 1) return;
    if (product.stockQuantity < quantity) {
      setError('Not enough stock available');
      return;
    }
    try {
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.productId === product.id);
        if (existingItem) {
          const updatedItems = prevItems.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          console.log('🛒 Updated existing item in cart:', product.name, 'quantity:', existingItem.quantity + quantity);
          return updatedItems;
        } else {
          const newItems = [...prevItems, { productId: product.id, product, quantity }];
          console.log('🛒 Added new item to cart:', product.name, 'quantity:', quantity);
          return newItems;
        }
      });
      setSuccess('Added to cart!');
    } catch (err: any) {
      setError(err.message || 'Failed to add to cart');
    }
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.productId === productId);
      const newItems = prevItems.filter(item => item.productId !== productId);
      console.log('🛒 Removed item from cart:', itemToRemove?.product.name);
      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );
      const updatedItem = updatedItems.find(item => item.productId === productId);
      console.log('🛒 Updated quantity for:', updatedItem?.product.name, 'new quantity:', quantity);
      return updatedItems;
    });
  };

  const clearCart = () => {
    console.log('🛒 Cart cleared');
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
    error,
    success,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 