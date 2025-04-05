import React, { useEffect, useState } from "react";
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
  ToastAndroid,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constant from "expo-constants";
import styles from "../style/MyOrdersStyle";
import generateInvoicePDF from "../utils/generateInvoicePDF";

const BASE_URL = Constant.expoConfig.extra.API_URL;
console.log(BASE_URL);

const MyOrdersScreen = () => {
  const navigation = useNavigation();

  const [orders, setOrders] = useState();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [userId, setUserId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (!storedData) throw new Error("No user data in storage");

      const parsedData = JSON.parse(storedData);
      console.log("User data from storage order screen:", parsedData);
      console.log("user id : ", parsedData._id);
      setUserId(parsedData._id);

      const response = await fetch(`${BASE_URL}order?userId=${parsedData._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch retailer profile");

      const data = await response.json();
      console.log("Retailer order data:", data.orders[0]);
      setOrders(
        data.orders.map((order) => ({
          ...order,
          id: order._id,
          total: order.totalAmount,
          status: order.orderStatus,
          paymentStatus: order.payment.status,
          date: order.timestamps.orderDate,
        }))
      );
    } catch (error) {
      console.info("Error fetching user details:", error.message);
      alert("Couldn’t load user details.");
    }
  };

  const fetchFilteredOrders = async (filterParams = {}) => {
    try {
      if (!userId) {
        alert("User not loaded yet!");
        return;
      }

      const query = new URLSearchParams({ userId, ...filterParams }).toString();
      console.log("filter query ", query);

      const response = await fetch(`${BASE_URL}order/filter?${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch filtered orders");

      const data = await response.json();
      setOrders(
        data.orders.map((order) => ({
          ...order,
          id: order._id,
          total: order.totalAmount,
          status: order.orderStatus,
          paymentStatus: order.payment.status,
          date: order.timestamps.orderDate,
        }))
      );
    } catch (error) {
      console.error("Error fetching filtered orders:", error.message);
      alert("Couldn’t load filtered orders: " + error.message);
    }
  };

  const applyFilters = () => {
    if (
      dateFilter === "All" &&
      statusFilter === "All" &&
      paymentStatusFilter === "All" &&
      categoryFilter === "All"
    ) {
      fetchCurrentUser();
    } else {
      const filterParams = {};
      if (dateFilter !== "All") filterParams.dateRange = dateFilter;
      if (statusFilter !== "All") filterParams.status = statusFilter;
      if (paymentStatusFilter !== "All")
        filterParams.paymentStatus = paymentStatusFilter;
      // Category filter not implemented yet—will add in next step
      fetchFilteredOrders(filterParams);
    }
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setDateFilter("All");
    setStatusFilter("All");
    setPaymentStatusFilter("All");
    setCategoryFilter("All");
    fetchCurrentUser();
    setFilterModalVisible(false);
  };

  const generatePDF = async (order) => {
    const orderId = order.orderId;
    console.log(`Generating PDF for order ${orderId}`);
    console.log(`Generating PDF for user ${userId}`);

    try {
      const response = await fetch(
        `${BASE_URL}invoice/?userId=${userId}&orderId=${order.orderId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch invoice");
      }

      const data = await response.json();
      const { billingData, address, calculations } = data.invoice;

      await generateInvoicePDF(billingData, address, {
        ...calculations,
        orderId,
      });
      alert("Invoice regenerated successfully!");
    } catch (error) {
      console.error("Regeneration error:", error);
      alert("Couldn’t regenerate invoice: " + error.message);
    }
  };

  const renderOrder = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.orderCard}
        onPress={() => {
          setSelectedOrder(item);
          setModalVisible(true);
          setOrderId(item.orderId);
        }}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order ID: {item.orderId}</Text>
          <Text style={styles.orderDate}>
            {item.timestamps?.orderDate?.split("T")[0]}
          </Text>
        </View>
        <Text style={styles.orderTotal}>Total: ₹{item.totalAmount}</Text>
        <Text
          style={[
            styles.orderStatus,
            {
              color:
                item.orderStatus === "Delivered"
                  ? "#4CAF50"
                  : item.orderStatus === "Pending"
                  ? "#FF9800"
                  : "#2196F3",
            },
          ]}
        >
          Status: {item.orderStatus}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleCancelOrder = async () => {
    console.log("userID", userId);
    console.log("orderToCancel", orderId);

    try {
      const response = await fetch(`${BASE_URL}order/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          orderId: orderId,
        }),
      });
      const result = await response.json();
      console.log("cancellation result : ", result);
      if (result.success === true || result.success === "true") {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderToCancel.orderId
              ? {
                  ...order,
                  orderStatus: "Cancelled",
                  payment: { ...order.payment, status: "Refunded" },
                }
              : order
          )
        );
        alert(result.message);
        // ToastAndroid("Order cancel successfully")
        ToastAndroid.show("Order cancel successfully", ToastAndroid.SHORT);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
    setCancelModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter" size={24} color="#6B48FF" />
        </TouchableOpacity>
      </View>

      {orders?.length === 0 ? (
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
              <View style={styles.modalBody}>
                <Text style={styles.modalDetail}>
                  Order ID: {selectedOrder.orderId}
                </Text>
                <Text style={styles.modalDetail}>
                  Date: {selectedOrder.timestamps.orderDate.split("T")[0]}
                </Text>
                <Text style={styles.modalDetail}>
                  Status: {selectedOrder.orderStatus}
                </Text>
                <Text style={styles.modalDetail}>
                  Payment Status: {selectedOrder.payment.status}
                </Text>

                {/* items table  */}
                <Text style={styles.modalSectionTitle}>Items</Text>
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                      Item Name
                    </Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                      Price
                    </Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                      Action
                    </Text>
                  </View>

                  <FlatList
                    data={selectedOrder.items}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.tableRow}>
                        <Pressable
                        onPress={()=>{
                          setModalVisible(false);
                          setSelectedOrder(null);
                          navigation.navigate("ProductDetail", { product: item.productId })
                        }
                        }
                        style={[styles.tableCell, { flex: 1 }]}
                        >
                          <Text
                          style={{padding:4}}
                          numberOfLines={1}
                          >{item.productId || "Unknown Product"}</Text></Pressable>
                        <Text style={[styles.tableCell, { flex: 1 }]}>
                          ₹{item.pricePerItem || "N/A"}
                        </Text>

                        <TouchableOpacity
                          style={styles.customizeButton}
                          onPress={() =>
                          {
                            setModalVisible(false);
                          setSelectedOrder(null);
                            navigation.navigate(
                              "ProductCustomization",
                              {
                              
                                  id: item.productId || item.productId,
                                orderId: selectedOrder.orderId,
                              }
                            )
                          }
                          }
                        >
                          <Ionicons
                            name="create-outline"
                            size={16}
                            color="#FFF"
                          />
                          <Text style={styles.customizeButtonText}>
                            Customize
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>

                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => generatePDF(selectedOrder)}
                >
                  <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.downloadButtonText}>
                    Download Invoice as PDF
                  </Text>
                </TouchableOpacity>

                {selectedOrder.orderStatus === "Pending" && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setOrderToCancel(selectedOrder);
                      setCancelModalVisible(true);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel Order</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Orders</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Date</Text>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      dateFilter === "All" && styles.filterButtonActive,
                    ]}
                    onPress={() => setDateFilter("All")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        dateFilter === "All" && styles.filterButtonTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      dateFilter === "Today" && styles.filterButtonActive,
                    ]}
                    onPress={() => setDateFilter("Today")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        dateFilter === "Today" && styles.filterButtonTextActive,
                      ]}
                    >
                      Today
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      dateFilter === "Last 7 Days" && styles.filterButtonActive,
                    ]}
                    onPress={() => setDateFilter("Last 7 Days")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        dateFilter === "Last 7 Days" &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      Last 7 Days
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      dateFilter === "Last 30 Days" &&
                        styles.filterButtonActive,
                    ]}
                    onPress={() => setDateFilter("Last 30 Days")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        dateFilter === "Last 30 Days" &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      Last 30 Days
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Status</Text>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      statusFilter === "All" && styles.filterButtonActive,
                    ]}
                    onPress={() => setStatusFilter("All")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        statusFilter === "All" && styles.filterButtonTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      statusFilter === "Pending" && styles.filterButtonActive,
                    ]}
                    onPress={() => setStatusFilter("Pending")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        statusFilter === "Pending" &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      Pending
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      statusFilter === "Shipped" && styles.filterButtonActive,
                    ]}
                    onPress={() => setStatusFilter("Shipped")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        statusFilter === "Shipped" &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      Shipped
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      statusFilter === "Delivered" && styles.filterButtonActive,
                    ]}
                    onPress={() => setStatusFilter("Delivered")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        statusFilter === "Delivered" &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      Delivered
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      statusFilter === "Cancel" && styles.filterButtonActive,
                    ]}
                    onPress={() => setStatusFilter("Cancel")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        statusFilter === "Cancel" &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      Canceled
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Payment Status</Text>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      paymentStatusFilter === "All" &&
                        styles.filterButtonActive,
                    ]}
                    onPress={() => setPaymentStatusFilter("All")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        paymentStatusFilter === "All" &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      paymentStatusFilter === "Success" &&
                        styles.filterButtonActive,
                    ]}
                    onPress={() => setPaymentStatusFilter("Success")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        paymentStatusFilter === "Success" &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      Paid
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      paymentStatusFilter === "Unpaid" &&
                        styles.filterButtonActive,
                    ]}
                    onPress={() => setPaymentStatusFilter("Unpaid")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        paymentStatusFilter === "Unpaid" &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      Unpaid
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      paymentStatusFilter === "Refunded" &&
                        styles.filterButtonActive,
                    ]}
                    onPress={() => setPaymentStatusFilter("Refunded")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        paymentStatusFilter === "Refunded" &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      Refunded
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterActions}>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={applyFilters}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetFilters}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={cancelModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {}]}>
            <Text
              style={[styles.modalTitle, { textAlign: "center", margin: 7 }]}
            >
              Cancel Order
            </Text>

            <ScrollView style={styles.modalBody}>
              <Text
                style={[
                  styles.modalDetail,
                  { fontWeight: "bold", marginBottom: 5 },
                ]}
              >
                Cancellation Policy
              </Text>
              <Text style={[styles.modalDetail, { color: "#333" }]}>
                - Orders can be canceled within 24 hours of placement or before
                shipping, whichever comes first.
              </Text>
              <Text style={[styles.modalDetail, { color: "#333" }]}>
                - Refunds will be credited to your original payment method
                within 5-7 business days after approval.
              </Text>

              <View style={[styles.filterActions]}>
                <TouchableOpacity
                  onPress={handleCancelOrder}
                  style={styles.applyButton}
                >
                  <Text style={styles.applyButtonText}>
                    Confirm Cancellation
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => setCancelModalVisible(false)}
                >
                  <Text style={styles.resetButtonText}>Close</Text>
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
