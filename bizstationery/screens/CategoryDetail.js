import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import styles from '../style/CategoryDetailStyle'; // Import styles from the separate file
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CategoryDetail = ({route}) => {
  const navigation = useNavigation();

  const category =route.params.category ; // Default to 'Pens' if not provided
  console.log('Category:', category);
  const [products, setProducts] = useState(); // Rename to 'products' for clarity
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(`http://192.168.43.3:5000/api/category/${category}`);
        const data = await response.json();
        // console.log('Data from API:', data);
        setProducts(data.product); // Store products directly
        // console.log('Products:', products);
    } catch (error) {
        console.log('Something went wrong, data not fetched from API:', error);
        Alert.alert('Error', 'Failed to load products. Please try again.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []); // Add category as dependency to refetch if it changes

  // Render each product item
  const renderItem = ({ item }) => (
    <Pressable
      style={styles.productContainer}
      onPress={() => navigation.navigate('ProductDetail', { product: item.id })}
    >
      <Image source={{ uri: item.image_link }} style={styles.productImage} />
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.productPrice}>₹{item.price}</Text>
      <Text style={styles.productStock}>
        Stock: {item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
      </Text>
    </Pressable>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B48FF" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow */}
      <View style={styles.headerContainer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.header}>Pens Category</Text>
      </View>

      {/* FlatList for Products */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) =>item.id} // Use _id or id for unique keys
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pens available in this category.</Text>
        }
      />
    </View>
  );
};

export default CategoryDetail;




