import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
  Image,
  ToastAndroid,
  ActivityIndicator,

} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../style/CustomizationRequestsStyle"; // Assuming a separate style file
import AsyncStorage from "@react-native-async-storage/async-storage";
// import ToastAndroid from 'react-native/Libraries/Components/ToastAndroid';
import Constant from "expo-constants";
import WebView from "react-native-webview";
import { RAZORPAY_KEY_ID} from "../constants/constants";

const BASE_URL = Constant.expoConfig.extra.API_URL;

const CustomizationRequestsScreen = () => {
  const navigation = useNavigation();

  // State for requests, selected request, modals, and filter
  const [requests, setRequests] = useState([]);
  const [retailerId, setRetailerId] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false); // New: Payment modal
  const [paymentUrl, setPaymentUrl] = useState('');

  // Fetch retailerId and requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storedData = await AsyncStorage.getItem("userData");
        if (!storedData) throw new Error("No user data in storage");
        const parsedData = JSON.parse(storedData);
        setRetailerId(parsedData.id);

        const response = await fetch(
          `${BASE_URL}customization/request?retailerId=${parsedData.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to fetch requests");
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        ToastAndroid.show("Failed to load requests", ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Render each request in the list
  const renderRequest = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedRequest(item); // Set the tapped request
        setModalVisible(true);
      }}
      style={styles.requestCard}
    >
      <View style={styles.requestHeader}>
        {/* <Text style={styles.requestId}>Request #{item._id}</Text> */}
        <Text style={styles.requestDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.requestProduct}>
        {item.productId.name || "Unknown Product"}
      </Text>
      <View style={styles.statusContainer}>
        <Ionicons
          name={
            item.status === "Pending"
              ? "time-outline"
              : item.status.includes("Accepted")
              ? "checkmark-circle-outline"
              : "close-circle-outline"
          }
          size={20}
          color={
            item.status === "Pending"
              ? "#FFA726"
              : item.status.includes("Accepted")
              ? "#4CAF50"
              : "#EF5350"
          }
        />
        <Text
          style={[
            styles.requestStatus,
            {
              color:
                item.status === "Pending"
                  ? "#FFA726"
                  : item.status.includes("Accepted")
                  ? "#4CAF50"
                  : "#EF5350",
            },
          ]}
        >
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );


  // Handle payment
  const handlePayment = async (requestId, priceAdjustment) => 
    {

      try {
        const storedData = await AsyncStorage.getItem("userData");  
        const parsedData = JSON.parse(storedData);
        const email = parsedData.email || 'retailer@example.com';
        const mobile = parsedData.mobile|| '1234567890';
        const name = parsedData.name || 'Retailer';

        const response = await fetch(`${BASE_URL}payment/create-payment`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
            amount: priceAdjustment*100,
            currency: 'INR',
            requestId,
          })
        })

        const data = await response.json();
        if (!response.ok || !data.orderId) {
          throw new Error(data.error || "Failed to create payment");
        }

        const checkoutPage = `
        <html>
          <body>
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            <script>
              var options = {
                key: "${RAZORPAY_KEY_ID}",
                amount: ${priceAdjustment * 100},
                currency: "INR",
                order_id: "${data.orderId}",
                name: "Customization Payment",
                description: "Extra Charge Payment",
                handler: function (response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify(response));
                },
                prefill: {
                  email: "${email}",
                  contact: "${mobile}",
                  name: "${name}"
                }
              };
              var rzp = new Razorpay(options);
              rzp.on('payment.failed', function (response) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ error: response.error }));
              });
              rzp.open();
            </script>
          </body>
        </html>
      `;

      setPaymentUrl(`data:text/html;base64,${btoa(checkoutPage)}`);
      setPaymentModalVisible(true);
      } catch (error) {
        console.error("Error fetching requests:", error);
        ToastAndroid.show("Failed to load payment", ToastAndroid.SHORT);
        
      }
    }


  //Handle webView payment

  const handleWebViewMessage = async (event) => {
    try {
      const paymentInfo = JSON.parse(event.nativeEvent.data);
      if(paymentInfo.error){
        setPaymentModalVisible(false);
        ToastAndroid.show('Payment failed', ToastAndroid.SHORT);
        return
      }

      const response = await fetch(`${BASE_URL}payment/${selectedRequest._id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id: paymentInfo.razorpay_order_id,
          razorpay_payment_id: paymentInfo.razorpay_payment_id,
          razorpay_signature: paymentInfo.razorpay_signature,
        })
      })

      const data = await response.json();
      if (response.ok) {
        ToastAndroid.show("Payment successful",ToastAndroid.SHORT)
        setRequests((prev)=>
        prev.map((req)=>
          req._id === selectedRequest._id ? {...req, paymentStatus: 'Paid'} : req
        ))
        setSelectedRequest({ ...selectedRequest, paymentStatus: 'Paid' });
        setPaymentModalVisible(false);
        setModalVisible(false);
        navigation.navigate('CustomizationRequests');
      }
    } catch (error) {
      console.error("Error handling payment:", error);
      ToastAndroid.show("Failed to handle payment", ToastAndroid.SHORT);
      setPaymentModalVisible(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customization Requests</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6B48FF" />
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#A0A0A0" />
          <Text style={styles.emptyText}>
            No customization requests available.
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.requestList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Request Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>

            {selectedRequest ? (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalDetail}>
                  Product: {selectedRequest.productId.name || "Unknown"}
                </Text>
                <Text style={styles.modalDetail}>
                  Date:{" "}
                  {new Date(selectedRequest.createdAt).toLocaleDateString()}
                </Text>

                {selectedRequest.orderId && (
                  <Text style={styles.modalDetail}>
                    Order ID: {selectedRequest.orderId}
                  </Text>
                )}
                <Text style={styles.modalSectionTitle}>
                  Customization Details:
                </Text>
                <Text style={styles.modalText}>
                  {selectedRequest.details || "No details provided"}
                </Text>

                {selectedRequest.priceAdjustment > 0 && (
                  <Text style={styles.modalText}>
                    Extra Cost: ₹{selectedRequest.priceAdjustment}
                  </Text>
                )}

                {selectedRequest.wholesalerMessage && (
                  <>
                    <Text style={styles.modalSectionTitle}>
                      wholesaler Response
                    </Text>
                    <Text style={styles.modalText}>
                      {selectedRequest.wholesalerMessage}
                    </Text>
                  </>
                )}

                {selectedRequest.images.length > 0 && (
                  <View style={styles.imageListContainer}>
                    <Text style={styles.modalSectionTitle}>Images:</Text>
                    <FlatList
                      data={selectedRequest.images}
                      renderItem={({ item }) => (
                        <Image
                          source={{ uri: item }}
                          style={styles.modalImage}
                        />
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                )}

                <View style={styles.statusContainer}>
                  <Ionicons
                    name={
                      selectedRequest.status === "Pending"
                        ? "time-outline"
                        : selectedRequest.status.includes("Accepted")
                        ? "checkmark-circle-outline"
                        : "close-circle-outline"
                    }
                    size={24}
                    color={
                      selectedRequest.status === "Pending"
                        ? "#FFA726"
                        : selectedRequest.status.includes("Accepted")
                        ? "#4CAF50"
                        : "#EF5350"
                    }
                  />
                  <Text
                    style={[
                      styles.modalStatus,
                      {
                        color:
                          selectedRequest.status === "Pending"
                            ? "#FFA726"
                            : selectedRequest.status.includes("Accepted")
                            ? "#4CAF50"
                            : "#EF5350",
                      },
                    ]}
                  >
                    Status: {selectedRequest.status}
                  </Text>
                </View>
                <Text style={styles.modalText}>
                  Payment Status: {selectedRequest.paymentStatus}
                </Text>
                {selectedRequest.status === 'Accepted (Extra Charge)' &&
                  selectedRequest.paymentStatus === 'Not Paid' && (
                    <TouchableOpacity
                      style={styles.payButton}
                      onPress={() => handlePayment(selectedRequest._id, selectedRequest.priceAdjustment)}
                    >
                      <Text style={styles.payButtonText}>
                        Pay Now (₹{selectedRequest.priceAdjustment})
                      </Text>
                    </TouchableOpacity>
                  )}
              </ScrollView>
            ) : (
              <ActivityIndicator size="large" color="#6B48FF" />
            )}
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal visible={paymentModalVisible} animationType="slide">
        <WebView source={{ uri: paymentUrl }} onMessage={handleWebViewMessage} style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.cancelPaymentButton}
          onPress={() => setPaymentModalVisible(false)}
        >
          <Text style={styles.cancelPaymentText}>Cancel Payment</Text>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default CustomizationRequestsScreen;
