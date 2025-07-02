import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { geminiService } from '../services/geminiService';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await productService.getAllProducts();
      setProducts(fetchedProducts);
      
      // Update AI service with current products
      geminiService.setProducts(fetchedProducts);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const value: ProductContextType = {
    products,
    loading,
    error,
    refreshProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}; 