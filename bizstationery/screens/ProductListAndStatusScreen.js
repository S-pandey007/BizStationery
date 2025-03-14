import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../style/ProductListAndStatusStyle";

const ProductListAndStatusScreen = () => {
  const navigation = useNavigation();

  // State for products, search, filters, and modal
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("None");
  const [newlyUpdatedFilter, setNewlyUpdatedFilter] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("All");

  // Dummy data (simulating database response)
  const dummyProducts = [
    {
      id: "1",
      name: "Ceiling Fan Winding Machine",
      price: 1200,
      stock: 10,
      stockStatus: "In Stock",
      availability: "Available",
      category: "Electronics",
      updatedAt: "2025-03-10",
      description: "High-quality winding machine for ceiling fans.",
    },
    {
      id: "2",
      name: "Electric Motor",
      price: 800,
      stock: 2,
      stockStatus: "Low Stock",
      availability: "Available",
      category: "Electronics",
      updatedAt: "2025-03-01",
      description: "Powerful motor for various applications.",
    },
    {
      id: "3",
      name: "LED Bulb Pack",
      price: 400,
      stock: 0,
      stockStatus: "Out of Stock",
      availability: "Unavailable",
      category: "Home Appliances",
      updatedAt: "2025-02-25",
      description: "Energy-saving LED bulbs, pack of 5.",
    },
    {
      id: "4",
      name: "T-Shirt",
      price: 300,
      stock: 50,
      stockStatus: "In Stock",
      availability: "Available",
      category: "Clothing",
      updatedAt: "2025-03-05",
      description: "Comfortable cotton t-shirt.",
    },
  ];

  // Load dummy data on mount
  useEffect(() => {
    setProducts(dummyProducts);
    setFilteredProducts(dummyProducts);
  }, []);

  // Search and filter logic
  useEffect(() => {
    let result = [...products];

    // Search by name or category
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "All") {
      result = result.filter((product) => product.category === categoryFilter);
    }

    // Filter by stock level
    if (stockFilter !== "All") {
      result = result.filter((product) => product.stockStatus === stockFilter);
    }

    // Filter by availability
    if (availabilityFilter !== "All") {
      result = result.filter((product) => product.availability === availabilityFilter);
    }

    // Filter by newly updated (within 7 days)
    if (newlyUpdatedFilter) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      result = result.filter(
        (product) => new Date(product.updatedAt) >= sevenDaysAgo
      );
    }

    // Sort by price
    if (priceFilter === "Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (priceFilter === "High to Low") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [
    searchQuery,
    categoryFilter,
    stockFilter,
    priceFilter,
    newlyUpdatedFilter,
    availabilityFilter,
    products,
  ]);

  // Reset filters
  const resetFilters = () => {
    setCategoryFilter("All");
    setStockFilter("All");
    setPriceFilter("None");
    setNewlyUpdatedFilter(false);
    setAvailabilityFilter("All");
    setFilterModalVisible(false);
  };

  // Render product item
  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
      </View>
      <Text style={styles.productCategory}>{item.category}</Text>
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.stockStatus,
            {
              color:
                item.stockStatus === "In Stock"
                  ? "#4CAF50"
                  : item.stockStatus === "Low Stock"
                  ? "#FFA726"
                  : "#EF5350",
            },
          ]}
        >
          {item.stockStatus} ({item.stock})
        </Text>
        <Text style={styles.availability}>
          {item.availability === "Available" ? "Available" : "Unavailable"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product List</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter" size={24} color="#6B48FF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products or categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={80} color="#A0A0A0" />
          <Text style={styles.emptyText}>No products found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
        />
      )}

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Products</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {/* Category Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Category</Text>
                <View style={styles.filterButtons}>
                  {["All", "Electronics", "Home Appliances", "Clothing"].map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.filterButton,
                        categoryFilter === category && styles.filterButtonActive,
                      ]}
                      onPress={() => setCategoryFilter(category)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          categoryFilter === category && styles.filterButtonTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Stock Level Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Stock Level</Text>
                <View style={styles.filterButtons}>
                  {["All", "In Stock", "Low Stock", "Out of Stock"].map((stock) => (
                    <TouchableOpacity
                      key={stock}
                      style={[
                        styles.filterButton,
                        stockFilter === stock && styles.filterButtonActive,
                      ]}
                      onPress={() => setStockFilter(stock)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          stockFilter === stock && styles.filterButtonTextActive,
                        ]}
                      >
                        {stock}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Availability Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Availability</Text>
                <View style={styles.filterButtons}>
                  {["All", "Available", "Unavailable"].map((avail) => (
                    <TouchableOpacity
                      key={avail}
                      style={[
                        styles.filterButton,
                        availabilityFilter === avail && styles.filterButtonActive,
                      ]}
                      onPress={() => setAvailabilityFilter(avail)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          availabilityFilter === avail && styles.filterButtonTextActive,
                        ]}
                      >
                        {avail}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort by Price</Text>
                <View style={styles.filterButtons}>
                  {["None", "Low to High", "High to Low"].map((price) => (
                    <TouchableOpacity
                      key={price}
                      style={[
                        styles.filterButton,
                        priceFilter === price && styles.filterButtonActive,
                      ]}
                      onPress={() => setPriceFilter(price)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          priceFilter === price && styles.filterButtonTextActive,
                        ]}
                      >
                        {price}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Newly Updated Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Newly Updated</Text>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    newlyUpdatedFilter && styles.filterButtonActive,
                  ]}
                  onPress={() => setNewlyUpdatedFilter(!newlyUpdatedFilter)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      newlyUpdatedFilter && styles.filterButtonTextActive,
                    ]}
                  >
                    Last 7 Days
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Reset Button */}
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};



export default ProductListAndStatusScreen;