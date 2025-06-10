import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducts } from '@/hooks/useProducts';
import { useRouter } from 'expo-router';

export default function AddProductScreen() {
  const [productName, setProductName] = useState('');
  const { addProduct } = useProducts();
  const router = useRouter();

  const handleAdd = async () => {
    if (!productName.trim()) {
      Alert.alert('Validation', 'Please enter a product name.');
      return;
    }
    
    const success = await addProduct(productName.trim());
    if (success) {
      Alert.alert('Success', 'Product added successfully!');
      setProductName('');
      router.push('/');
    } else {
      Alert.alert('Error', 'Failed to add product.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add New Product</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter product name (max 100 characters)"
        value={productName}
        onChangeText={setProductName}
        maxLength={100}
        multiline
        autoFocus
      />
      
      <Text style={styles.charCount}>
        {productName.length}/100 characters
      </Text>
      
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add Product</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    color: '#666',
    marginTop: 8,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});