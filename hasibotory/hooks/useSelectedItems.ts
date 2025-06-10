import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectedProduct } from '@/types';

const STORAGE_KEY = 'selected_products';

export function useSelectedItems() {
  const [selectedItems, setSelectedItems] = useState<SelectedProduct[]>([]);

  // ✅ Automatically load from storage on mount
  useEffect(() => {
    loadSelectedItems();
  }, []);

  const saveSelectedItems = async (items: SelectedProduct[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save selected items:', error);
    }
  };

  const loadSelectedItems = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        setSelectedItems(JSON.parse(json));
      }
    } catch (error) {
      console.error('Failed to load selected items:', error);
    }
  };

  const toggleSelectItem = (name: string) => {
    setSelectedItems(prev => {
      const exists = prev.find(item => item.name === name);
      let newItems;
      if (exists) {
        newItems = prev.map(item =>
          item.name === name
            ? { ...item, isSelected: !item.isSelected }
            : item
        );
      } else {
        newItems = [...prev, { name, quantity: 1, isSelected: true }];
      }
      saveSelectedItems(newItems);
      return newItems;
    });
  };

  const updateQuantity = (name: string, quantity: number) => {
    setSelectedItems(prev => {
      const newItems = prev.map(item =>
        item.name === name ? { ...item, quantity } : item
      );
      saveSelectedItems(newItems);
      return newItems;
    });
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
    saveSelectedItems([]);
  };

  const getSelectedCount = () => {
    return selectedItems.filter(item => item.isSelected).length;
  };

  return {
    selectedItems,
    toggleSelectItem,
    updateQuantity,
    clearSelectedItems,
    loadSelectedItems,
    getSelectedCount,
  };
}
