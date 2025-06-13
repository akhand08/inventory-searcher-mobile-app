import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useProducts } from '@/hooks/useProducts';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ visible, onClose }) => {
  const [productName, setProductName] = useState('');
  const { addProduct } = useProducts();

  const handleAdd = async () => {
    if (!productName.trim()) {
      Alert.alert('Validation', 'Please enter a product name.');
      return;
    }
    
    const success = await addProduct(productName.trim());
    if (success) {
      Alert.alert('Success', 'Product added successfully!');
      setProductName('');
      onClose();
    } else {
      Alert.alert('Error', 'Failed to add product.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
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
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAdd}>
              <Text style={[styles.buttonText, styles.addButtonText]}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    color: '#666',
    marginTop: 8,
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    marginLeft: 12,
  },
  buttonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  addButtonText: {
    color: 'white',
  },
});

export default AddProductModal;