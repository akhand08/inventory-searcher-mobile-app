import { useState, useEffect } from 'react';
import { Product } from '@/types';
import productsData from '../data/products.json';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // ✅ Correctly extract the array from the JSON
        setProducts(productsData.products as Product[]);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const addProduct = async (productName: string): Promise<boolean> => {
    try {
      const newProduct: Product = { name: productName };
      setProducts(prev => [...prev, newProduct]);
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      return false;
    }
  };

  return {
    products,
    loading,
    addProduct,
  };
};
