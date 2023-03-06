import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const itemsJson = await AsyncStorage.getItem('items');
      const items = itemsJson ? JSON.parse(itemsJson) : [];
      setItems(items);
    } catch (e) {
      console.error('Failed to load items');
    }
  };

  const saveItems = async items => {
    try {
      await AsyncStorage.setItem('items', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save item');
    }
  };

  const handleAddItem = () => {
    if (!product || !amount) {
      return;
    }
    const id = new Date().getTime().toString();
    const newItem = { id, product, amount };
    const newItems = [...items, newItem];
    setItems(newItems);
    saveItems(newItems);
    setProduct('');
    setAmount('');
  };

  const handleRemoveItem = id => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    saveItems(newItems);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Shopping List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Product"
          value={product}
          onChangeText={setProduct}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddItem}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.product}, {item.amount}</Text>
            <TouchableOpacity
              style={styles.itemButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Text style={styles.itemButtonText}>Bought</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:150
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    margin: 4,
    width: 120,
    borderRadius:4
  },
  button: {
    backgroundColor: '#00cc99',
    padding: 8,
    borderRadius: 4,
    marginLeft: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemButton: {
    backgroundColor: '#cc0000',
    padding: 8,
    borderRadius: 4,
  },
  itemButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});