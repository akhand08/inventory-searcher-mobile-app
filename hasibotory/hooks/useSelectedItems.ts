import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectedProduct } from '@/types';

const STORAGE_KEY = 'selected_products';

export function useSelectedItems() {
  const [selectedItems, setSelectedItems] = useState<SelectedProduct[]>([]);

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
      const index = prev.findIndex(item => item.name === name);
      let newItems: SelectedProduct[];

      if (index !== -1) {
        const existingItem = prev[index];
        const updatedItem = { ...existingItem, isSelected: !existingItem.isSelected };

        // If selected, move to top; otherwise update in place
        if (updatedItem.isSelected) {
          newItems = [updatedItem, ...prev.filter(item => item.name !== name)];
        } else {
          newItems = prev.map(item =>
            item.name === name ? updatedItem : item
          );
        }
      } else {
        const newItem = { name, quantity: 1, isSelected: true };
        newItems = [newItem, ...prev];
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
