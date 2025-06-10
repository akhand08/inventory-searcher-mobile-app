import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.checkbox, isSelected && styles.checkedCheckbox]}
        onPress={() => onToggleSelect(product.name)}
      >
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      
      <Text style={styles.productName}>{product.name}</Text>
      
      {isSelected && (
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={quantity.toString()}
          onChangeText={handleQuantityChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedCheckbox: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  productName: {
    flex: 1,
    fontSize: 16,
  },
  quantityInput: {
    width: 50,
    height: 32,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
});

export default ProductItem;
