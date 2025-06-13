import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SelectedProduct, Product } from '@/types';

interface ProductItemProps {
  product: Product;
  selectedItems: SelectedProduct[];
  onToggleSelect: (name: string) => void;
  onUpdateQuantity: (name: string, quantity: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  selectedItems,
  onToggleSelect,
  onUpdateQuantity,
}) => {
  const selectedItem = selectedItems.find(item => item.name === product.name);
  const isSelected = selectedItem?.isSelected ?? false;
  const quantity = selectedItem?.quantity ?? 1;

  const handleQuantityChange = (text: string) => {
    const num = parseInt(text, 10);
    if (!isNaN(num) && num > 0) {
      onUpdateQuantity(product.name, num);
    }
  };

  const increaseQuantity = () => {
    onUpdateQuantity(product.name, quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.name, quantity - 1);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => onToggleSelect(product.name)}
    >
      <Text style={[styles.productName, isSelected && styles.selectedText]}>
        {product.name}
      </Text>
      
      {isSelected && (
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
            <Ionicons name="remove" size={20} color="#007AFF" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={quantity.toString()}
            onChangeText={handleQuantityChange}
          />
          
          <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
            <Ionicons name="add" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedContainer: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  productName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: 'white',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    width: 60,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 6,
    textAlign: 'center',
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});

export default ProductItem;