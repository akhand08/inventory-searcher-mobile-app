import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useSelectedItems } from '@/hooks/useSelectedItems';

export default function ViewSelectedScreen() {
  const {
    selectedItems,
    updateQuantity,
    toggleSelectItem,
    clearSelectedItems,
  } = useSelectedItems();

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        key={item.name}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          borderBottomWidth: 1,
          borderColor: '#ddd',
          paddingBottom: 8,
        }}
      >
        <Text style={{ flex: 1, fontSize: 16 }}>
          {index + 1}. {item.name} {'--->'} 
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Minus button */}
          <TouchableOpacity
            onPress={() => {
              const newQty = Math.max(1, item.quantity - 1);
              updateQuantity(item.name, newQty);
            }}
            style={{
              borderWidth: 1,
              borderColor: '#999',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 4,
              marginRight: 8,
            }}
          >
            <Text style={{ fontSize: 18 }}>-</Text>
          </TouchableOpacity>

          {/* Quantity input */}
          <TextInput
            value={String(item.quantity)}
            keyboardType="numeric"
            onChangeText={(text) => {
              // Only allow numbers, no empty or zero
              let qty = parseInt(text, 10);
              if (isNaN(qty) || qty < 1) qty = 1;
              updateQuantity(item.name, qty);
            }}
            style={{
              width: 50,
              height: 35,
              borderColor: '#999',
              borderWidth: 1,
              textAlign: 'center',
              fontSize: 16,
              paddingVertical: 0,
              marginRight: 8,
            }}
          />

          {/* Plus button */}
          <TouchableOpacity
            onPress={() => {
              updateQuantity(item.name, item.quantity + 1);
            }}
            style={{
              borderWidth: 1,
              borderColor: '#999',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 4,
            }}
          >
            <Text style={{ fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
      {selectedItems.length === 0 ? (
        <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 40 }}>
          No items selected.
        </Text>
      ) : (
        <>
          <FlatList
            data={selectedItems.filter(item => item.isSelected)}
            keyExtractor={(item) => item.name}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <TouchableOpacity
            onPress={clearSelectedItems}
            style={{
              backgroundColor: '#e74c3c',
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              Clear Selected Items
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}













































// import React from 'react';
// import { View, Text, FlatList } from 'react-native';
// import { useSelectedItems } from '@/hooks/useSelectedItems';

// export default function ViewSelectedScreen() {
//   const { selectedItems } = useSelectedItems();

//   const selected = selectedItems.filter(item => item.isSelected);

//   return (
//     <View style={{ padding: 16 }}>
//       <Text style={{ fontSize: 18, marginBottom: 10 }}>Selected Items:</Text>
//       {selected.length === 0 ? (
//         <Text>No items selected.</Text>
//       ) : (
//         <FlatList
//           data={selected}
//           keyExtractor={(item, index) => `${item.name}-${index}`}
//           renderItem={({ item }) => (
//             <View style={{ marginBottom: 8 }}>
//               <Text>{item.name} (Qty: {item.quantity})</Text>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// }
