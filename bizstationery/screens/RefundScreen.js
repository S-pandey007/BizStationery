import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constant from "expo-constants";
import { Linking } from "react-native";
import styles from "../style/MyOrdersStyle"; // Reuse styles for consistency

const BASE_URL = Constant.expoConfig.extra.API_URL;

const RefundScreen = () => {
  const navigation = useNavigation();
  const [refunds, setRefunds] = useState([]);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  // Fetch refunds when screen loads
  useEffect(() => {
    fetchRefunds();
  }, []);

  // Get userId and fetch refunds
  const fetchRefunds = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (!storedData) throw new Error("No user data in storage");

      const parsedData = JSON.parse(storedData);
      console.log("Parsed Data from refund:", parsedData); // Debugging line
      console.log("User ID:", parsedData._id); // Debugging line
      setUserId(parsedData._id);

      const response = await fetch(
        `${BASE_URL}refund?userId=${parsedData._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch refunds");

      const data = await response.json();
      setRefunds(data.refunds); // Expecting { success: true, refunds: [...] }
    } catch (error) {
      console.error("Error fetching refunds:", error.message);
      alert("Couldn’t load refunds. Please try again.");
    }
  };

  // Render each refund in the list
  const renderRefund = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard} // Reuse order card style
      onPress={() => {
        setSelectedRefund(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Refund ID: {item.refundKey || "N/A"}</Text>
        <Text style={styles.orderDate}>
          {new Date(item.timestamps.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.orderTotal}>Amount: ₹{item.amount}</Text>
      <Text
        style={[
          styles.orderStatus,
          {
            color:
              item.status === "Completed"
                ? "#4CAF50" // Green
                : item.status === "Initiated"
                ? "#FF9800" // Orange
                : "#FF4444", // Red for Failed
          },
        ]}
      >
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back and refresh */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Refunds</Text>
        <TouchableOpacity onPress={fetchRefunds}>
          <Ionicons name="refresh" size={24} color="#6B48FF" />
        </TouchableOpacity>
      </View>

      {/* Refund List or Empty State */}
      {refunds.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cash-outline" size={80} color="#A0A0A0" />
          <Text style={styles.emptyText}>No refunds yet.</Text>
        </View>
      ) : (
        <FlatList
          data={refunds}
          renderItem={renderRefund}
          keyExtractor={(item) => item.refundKey || item._id} // Use refundKey or MongoDB _id
          contentContainerStyle={styles.orderList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Refund Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Refund Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            {selectedRefund && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalDetail}>
                  Refund ID: {selectedRefund.refundKey || "Pending"}
                </Text>
                <Text style={styles.modalDetail}>
                  Order ID: {selectedRefund.orderId}
                </Text>
                <Text style={styles.modalDetail}>
                  Amount: ₹{selectedRefund.amount}
                </Text>
                <Text style={styles.modalDetail}>
                  Status: {selectedRefund.status}
                </Text>
                <Text style={styles.modalDetail}>
                  Requested:{" "}
                  {new Date(
                    selectedRefund.timestamps.createdAt
                  ).toLocaleString()}
                </Text>
                {selectedRefund.status === "Completed" && (
                  <Text style={styles.modalDetail}>
                    Completed:{" "}
                    {new Date(
                      selectedRefund.timestamps.completedAt
                    ).toLocaleString()}
                  </Text>
                )}
                <Text style={styles.modalDetail}>
                  Reason: {selectedRefund.reason || "Not specified"}
                </Text>
                <Text style={styles.modalDetail}>
                  Payment Method: {selectedRefund.paymentMethod || "Card"}{" "}
                  {/* Placeholder */}
                </Text>
                {selectedRefund.status !== "Completed" && (
                  <Text
                    style={[
                      styles.modalDetail,
                      { fontStyle: "italic", color: "#666" },
                    ]}
                  >
                    Expected by:{" "}
                    {new Date(
                      new Date(selectedRefund.timestamps.createdAt).getTime() +
                        7 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </Text>
                )}
                {/* add company's support team email  */}
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "mailto:shubhampandey8663@gmail.com?subject=Refund Support"
                    )
                  }
                >
                  <Text
                    style={[
                      styles.modalDetail,
                      {
                        color: "#6B48FF",
                        marginTop: 10,
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    Need help? Contact support@yourapp.com
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RefundScreen;
