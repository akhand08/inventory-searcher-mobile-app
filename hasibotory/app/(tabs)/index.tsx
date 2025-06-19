import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProducts } from '../../hooks/useProducts';
import { useSelectedItems } from '../../hooks/useSelectedItems';

import ProductItem from '@/components/ProductItems';
import AddProductModal from '@/components/AddProductModal';
import { Product } from '@/types';
import { generatePDF } from '@/utils/pdf';

const ITEMS_PER_PAGE = 20;

export default function HomeScreen() {
  const router = useRouter();
  const { products, loading } = useProducts();
  const selectedItemsHook = useSelectedItems();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    selectedItemsHook.loadSelectedItems();
  }, []);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase().trim();

    // If no search query, use all products
    const all = lowerQuery
      ? products.filter(product => product.name.toLowerCase().includes(lowerQuery))
      : products;

    // Separate selected and unselected products
    const selectedMap = new Map(
      selectedItemsHook.selectedItems.map(item => [item.name, item]),
    );

    const selected = all.filter(p => selectedMap.has(p.name)); 
    const unselected = all.filter(p => !selectedMap.has(p.name));  

    // Prioritize selected items
    return [...selected, ...unselected];
  }, [products, searchQuery, selectedItemsHook.selectedItems]);

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Selection',
      'Are you sure you want to clear all selected items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: selectedItemsHook.clearSelectedItems },
      ],
    );
  };

  const handleView = () => {
    const selectedCount = selectedItemsHook.getSelectedCount();
    if (selectedCount === 0) {
      Alert.alert('No Items Selected', 'Please select some items first.');
      return;
    }
    router.push('/view-selected');
  };

  const handlePDF = async () => {
    if (selectedItemsHook.getSelectedCount() === 0) {
      Alert.alert('No Items Selected', 'Please select some items first.');
      return;
    }
    try {
      await generatePDF(selectedItemsHook.selectedItems);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate or share PDF.');
      console.error('PDF generation error?', error);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductItem
      product={item}
      selectedItems={selectedItemsHook.selectedItems}
      onToggleSelect={selectedItemsHook.toggleSelectItem}
      onUpdateQuantity={selectedItemsHook.updateQuantity}
    />
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
        onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}>
        <Text style={styles.paginationText}>
          Previous
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </Text>
      
      <TouchableOpacity
        style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
        onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}>
        <Text style={styles.paginationText}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* App Title */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          HSK MMM
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>
            Go
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleClear}>
          <Text style={styles.actionButtonText}>
            Clear
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleView}>
          <Text style={styles.actionButtonText}>
            View ({selectedItemsHook.getSelectedCount()})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handlePDF}>
          <Text style={styles.actionButtonText}>
            PDF
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={paginatedProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        style={styles.productList}
        showsVerticalScrollIndicator={false}
      />

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}

      {/* Add Product Modal */}
      <AddProductModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e0e0e0',
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#006400',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  productList: {
    flex: 1,
    padding: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  paginationButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationText: {
    color: 'white',
    fontWeight: '600',
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});