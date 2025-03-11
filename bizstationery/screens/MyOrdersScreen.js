import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useNavigation } from "@react-navigation/native";

import styles from "../style/MyOrdersStyle";
const MyOrdersScreen = () => {
    const navigation = useNavigation()
  // Hardcoded orders data with additional fields (payment status, product category)
  const initialOrders = [
    {
      id: "1",
      date: "2025-02-23",
      total: 1500,
      status: "Delivered",
      paymentStatus: "Paid",
      category: "Electronics",
      items: [
        { name: "Ceiling Fan Winding Machine", quantity: 1, price: 1200 },
        { name: "Stator Coil", quantity: 2, price: 150 },
      ],
    },
    {
      id: "2",
      date: "2025-02-15",
      total: 800,
      status: "Pending",
      paymentStatus: "Unpaid",
      category: "Electronics",
      items: [{ name: "Electric Motor", quantity: 1, price: 800 }],
    },
    {
      id: "3",
      date: "2025-01-10",
      total: 2000,
      status: "Shipped",
      paymentStatus: "Partially Paid",
      category: "Home Appliances",
      items: [{ name: "LED Bulb Pack", quantity: 5, price: 400 }],
    },
  ];

  // State for orders, modal visibility, filter modal, and filters
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Filter orders based on all criteria
  const applyFilters = () => {
    let filtered = [...initialOrders];

    // Date Filter
    const now = new Date();
    if (dateFilter === "Last 7 Days") {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      });
    } else if (dateFilter === "Last 30 Days") {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
      });
    }

    // Status Filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Payment Status Filter
    if (paymentStatusFilter !== "All") {
      filtered = filtered.filter((order) => order.paymentStatus === paymentStatusFilter);
    }

    // Product Category Filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter((order) => order.category === categoryFilter);
    }

    setOrders(filtered);
    setFilterModalVisible(false); // Close modal after applying
  };

  // Reset filters
  const resetFilters = () => {
    setDateFilter("All");
    setStatusFilter("All");
    setPaymentStatusFilter("All");
    setCategoryFilter("All");
    setOrders(initialOrders);
    setFilterModalVisible(false); // Close modal after resetting
  };

  // Generate and download PDF invoice
  const generatePDF = async (order) => {
    try {
      const html = `
        <h1>Order Invoice</h1>
        <p>Order ID: ${order.id}</p>
        <p>Date: ${order.date}</p>
        <p>Status: ${order.status}</p>
        <p>Payment Status: ${order.paymentStatus}</p>
        <p>Category: ${order.category}</p>
        <h2>Items:</h2>
        <ul>
          ${order.items.map((item) => `<li>${item.name} - Qty: ${item.quantity} - ₹${item.price}</li>`).join("")}
        </ul>
        <p>Total: ₹${order.total}</p>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
      Alert.alert("Success", "PDF generated and shared!");
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF: " + error.message);
    }
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        setSelectedOrder(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
      <Text style={styles.orderTotal}>Total: ₹{item.total}</Text>
      <Text style={[styles.orderStatus, { color: item.status === "Delivered" ? "#4CAF50" : item.status === "Pending" ? "#FF9800" : "#2196F3" }]}>
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

//   if (orders.length === 0) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>My Orders</Text>
//           <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
//             <Ionicons name="filter" size={24} color="#6B48FF" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.emptyContainer}>
//           <Ionicons name="cart-outline" size={80} color="#A0A0A0" />
//           <Text style={styles.emptyText}>No orders available.</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter" size={24} color="#6B48FF" />
        </TouchableOpacity>
      </View>

      {/* Conditionally render order list or empty state */}
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#A0A0A0" />
          <Text style={styles.emptyText}>No orders available.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.orderList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Order Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            {selectedOrder && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalDetail}>Order ID: {selectedOrder.id}</Text>
                <Text style={styles.modalDetail}>Date: {selectedOrder.date}</Text>
                <Text style={styles.modalDetail}>Status: {selectedOrder.status}</Text>
                <Text style={styles.modalDetail}>Payment Status: {selectedOrder.paymentStatus}</Text>
                <Text style={styles.modalDetail}>Category: {selectedOrder.category}</Text>
                <Text style={styles.modalSectionTitle}>Items:</Text>
                {selectedOrder.items.map((item, index) => (
                  <View key={index} style={styles.modalItem}>
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    <Text style={styles.modalItemText}>Qty: {item.quantity}</Text>
                    <Text style={styles.modalItemText}>₹{item.price}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => generatePDF(selectedOrder)}
                >
                  <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.downloadButtonText}>Download Invoice as PDF</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Orders</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {/* Date Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Date</Text>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[styles.filterButton, dateFilter === "All" && styles.filterButtonActive]}
                    onPress={() => setDateFilter("All")}
                  >
                    <Text style={[styles.filterButtonText, dateFilter === "All" && styles.filterButtonTextActive]}>All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, dateFilter === "Last 7 Days" && styles.filterButtonActive]}
                    onPress={() => setDateFilter("Last 7 Days")}
                  >
                    <Text style={[styles.filterButtonText, dateFilter === "Last 7 Days" && styles.filterButtonTextActive]}>Last 7 Days</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, dateFilter === "Last 30 Days" && styles.filterButtonActive]}
                    onPress={() => setDateFilter("Last 30 Days")}
                  >
                    <Text style={[styles.filterButtonText, dateFilter === "Last 30 Days" && styles.filterButtonTextActive]}>Last 30 Days</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Status Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Status</Text>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[styles.filterButton, statusFilter === "All" && styles.filterButtonActive]}
                    onPress={() => setStatusFilter("All")}
                  >
                    <Text style={[styles.filterButtonText, statusFilter === "All" && styles.filterButtonTextActive]}>All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, statusFilter === "Pending" && styles.filterButtonActive]}
                    onPress={() => setStatusFilter("Pending")}
                  >
                    <Text style={[styles.filterButtonText, statusFilter === "Pending" && styles.filterButtonTextActive]}>Pending</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, statusFilter === "Shipped" && styles.filterButtonActive]}
                    onPress={() => setStatusFilter("Shipped")}
                  >
                    <Text style={[styles.filterButtonText, statusFilter === "Shipped" && styles.filterButtonTextActive]}>Shipped</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, statusFilter === "Delivered" && styles.filterButtonActive]}
                    onPress={() => setStatusFilter("Delivered")}
                  >
                    <Text style={[styles.filterButtonText, statusFilter === "Delivered" && styles.filterButtonTextActive]}>Delivered</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Payment Status Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Payment Status</Text>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[styles.filterButton, paymentStatusFilter === "All" && styles.filterButtonActive]}
                    onPress={() => setPaymentStatusFilter("All")}
                  >
                    <Text style={[styles.filterButtonText, paymentStatusFilter === "All" && styles.filterButtonTextActive]}>All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, paymentStatusFilter === "Paid" && styles.filterButtonActive]}
                    onPress={() => setPaymentStatusFilter("Paid")}
                  >
                    <Text style={[styles.filterButtonText, paymentStatusFilter === "Paid" && styles.filterButtonTextActive]}>Paid</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, paymentStatusFilter === "Unpaid" && styles.filterButtonActive]}
                    onPress={() => setPaymentStatusFilter("Unpaid")}
                  >
                    <Text style={[styles.filterButtonText, paymentStatusFilter === "Unpaid" && styles.filterButtonTextActive]}>Unpaid</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, paymentStatusFilter === "Partially Paid" && styles.filterButtonActive]}
                    onPress={() => setPaymentStatusFilter("Partially Paid")}
                  >
                    <Text style={[styles.filterButtonText, paymentStatusFilter === "Partially Paid" && styles.filterButtonTextActive]}>Partially Paid</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Product Category Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Product Category</Text>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[styles.filterButton, categoryFilter === "All" && styles.filterButtonActive]}
                    onPress={() => setCategoryFilter("All")}
                  >
                    <Text style={[styles.filterButtonText, categoryFilter === "All" && styles.filterButtonTextActive]}>All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, categoryFilter === "Electronics" && styles.filterButtonActive]}
                    onPress={() => setCategoryFilter("Electronics")}
                  >
                    <Text style={[styles.filterButtonText, categoryFilter === "Electronics" && styles.filterButtonTextActive]}>Electronics</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, categoryFilter === "Clothing" && styles.filterButtonActive]}
                    onPress={() => setCategoryFilter("Clothing")}
                  >
                    <Text style={[styles.filterButtonText, categoryFilter === "Clothing" && styles.filterButtonTextActive]}>Clothing</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, categoryFilter === "Home Appliances" && styles.filterButtonActive]}
                    onPress={() => setCategoryFilter("Home Appliances")}
                  >
                    <Text style={[styles.filterButtonText, categoryFilter === "Home Appliances" && styles.filterButtonTextActive]}>Home Appliances</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterActions}>
                <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MyOrdersScreen;