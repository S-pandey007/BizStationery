import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput
} from "react-native";
import Constants from "expo-constants";
import styles from "../style/SearchStyle";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';

const BASE_URL = Constants.expoConfig.extra.API_URL;
// console.log(BASE_URL);

const SearchScreen = ({ route }) => {
  const { query } = route.params;
  const navigation = useNavigation()
//   console.log(query)
const [results, setResults] = useState({ categories: [], products: [] });
const [message, setMessage] = useState("Searching....");
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [allCategories, setAllCategories] = useState([]);

const [modalVisible, setModalVisible] = useState(false); // New: Modal visibility
const [selectedCategory, setSelectedCategory] = useState('');

const [minPrice, setMinPrice] = useState(''); // New: Min price
const [maxPrice, setMaxPrice] = useState(''); // New: Max price

// Fetch all categories when screen loads
useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}category/`);
        const data = await response.json();
        // console.log("category :",data);
        
        if (response.ok) {
          setAllCategories(data.categories);
        } else {
          console.log('Failed to fetch categories:', data.message);
        }
      } catch (error) {
        console.log('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
// console.log(allCategories);

useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        let url = `${BASE_URL}product/search?q=${query}&page=${currentPage}&limit=7` 
        if (selectedCategory) {
            url += `&categoryId=${selectedCategory}`; // Add category filter
          }
          if (minPrice) {
            url += `&minPrice=${minPrice}`;
          }
          if (maxPrice) {
            url += `&maxPrice=${maxPrice}`;
          }
        const response = await fetch(url);
        console.log(url);
        
        const data = await response.json();
  
        if (response.ok) {
          setResults({
            categories: data.results.categories,
            products: data.results.products,
          });
          setTotalPages(data.totalPages);
          setMessage(
            data.results.products.length > 0 || data.results.categories.length > 0
              ? ""
              : "No results found"
          );
        } else {
          setResults({ categories: [], products: [] });
          setMessage(data.message || "Something went wrong");
        }
      } catch (error) {
        setResults({ categories: [], products: [] });
        setMessage("Error fetching search results");
        console.log("Search error: ", error);
      }
    };
    fetchSearchResults();
  }, [query, currentPage,selectedCategory,minPrice, maxPrice]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap: 7 }}>
        <Feather onPress={() => navigation.navigate("Home")} name="arrow-left" size={28} color="black" />
        <Text style={styles.title}>Search Results for "{query}"</Text>
        <Ionicons onPress={() => setModalVisible(true)} name="filter" size={24} color="#6B48FF" />
      </View>
  
      {/* Categories Section */}
      {results.categories.length > 0 && (
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Matching Categories</Text>
          <FlatList
            data={results.categories}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => navigation.navigate('CategoryDetail', { category: item._id })}
              >
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
  
      {/* Products Section */}
      <FlatList
        data={results.products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ProductDetail", { product: item._id })}
            style={styles.itemContainer}
          >
            <Image
              source={{ uri: item.images[0] }}
              style={styles.itemImage}
              resizeMode="contain"
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.variants[0].priceAdjustment}</Text>
              <Text style={styles.itemVariants}>{item.variants.length} variants</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
  
      <Text style={styles.message}>{message}</Text>
  
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.button, currentPage === 1 && styles.disabledButton]}
          onPress={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <FontAwesome name="angle-left" size={24} color="#fff" />
            <Text style={styles.buttonText}>Previous</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>Page {currentPage} of {totalPages}</Text>
        <TouchableOpacity
          style={[styles.button, currentPage === totalPages && styles.disabledButton]}
          onPress={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text style={styles.buttonText}>Next</Text>
            <FontAwesome name="angle-right" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Options</Text>

          {/* Category Dropdown */}
          <Text style={styles.filterLabel}>Category</Text>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
            style={styles.picker}
          >
            <Picker.Item label="All Categories" value="" />
            {allCategories.map((category) => (
              <Picker.Item key={category._id} label={category.name} value={category._id} />
            ))}
          </Picker>

          {/* Price Range */}
      <Text style={styles.filterLabel}>Price Range (₹)</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput
          style={styles.priceInput}
          placeholder="Min"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={setMinPrice}
        />
        <TextInput
          style={styles.priceInput}
          placeholder="Max"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={setMaxPrice}
        />
      </View>

          {/* Apply and Close Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {
            setModalVisible(false); // Close modal
            setCurrentPage(1); // Reset to page 1 for new filter
            // Fetch happens automatically via useEffect
          }}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
        </View>
      </View>
    </Modal>
    </View>
  );
};

export default SearchScreen;
