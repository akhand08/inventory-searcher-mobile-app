// app/view-selected.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import { useSelectedItems } from '@/hooks/useSelectedItems';
import { SelectedProduct } from '@/types';


export default function ViewSelectedScreen() {
  const { selectedItems } = useSelectedItems();

  const itemsToShow = selectedItems.filter(item => item.isSelected && item.quantity > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Selected Products</Text>
      <FlatList
        data={itemsToShow}
        keyExtractor={(item, idx) => `${item.name}-${idx}`}
        renderItem={({ item }: { item: SelectedProduct }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.qty}>Quantity: {item.quantity}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  itemContainer: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  name: { fontSize: 16 },
  qty: { fontSize: 14, color: '#555' },
});
