import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/slice/cartSlice"; // Path matches CartScreen
import generateInvoicePDF from "../utils/generateInvoicePDF";
import { RAZORPAY_KEY_ID} from "../constants/constants";
import newStyles from '../style/ProceedOrderStyle'

import   Constant from 'expo-constants'
const BASE_URL = Constant.expoConfig.extra.API_URL;
console.log(BASE_URL)

const ProceedOrder = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const billingData = route.params.billingData || [];
  console.log("billingData:", billingData);

  // User data states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [userId, setUserId] = useState("");

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (!storedData) throw new Error("No user data in storage");
        const parsedData = JSON.parse(storedData);
        console.log("User data from storage:", parsedData);

        setName(parsedData.name || "Unknown");
        setEmail(parsedData.email || "");
        setMobile(parsedData.mobile || "");

        const response = await fetch(
          `${BASE_URL}retailer/profile/${parsedData.name}/${parsedData.mobile}/${parsedData.email}`
        );
        if (!response.ok) throw new Error("Failed to fetch retailer profile");
        const data = await response.json();
        console.log("Retailer profile:", data);
        setUserId(data.data._id || "");
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        alert("Couldn’t load user details. Please log in again.");
      }
    };
    fetchUserDetails();
  }, []);

  // Calculations (typo fixed)
  const total_weight = billingData
    .reduce((sum, item) => sum + Number(item.variant?.weight || 0) * Number(item.quantity || 0), 0) / 1000;
  const Transport_expenses_PerKG = 120;
  const total_Transport_expenses_WithoutGST = Transport_expenses_PerKG * total_weight; // Fixed
  const Transport_tax_Rate = 5;
  const Transport_tax = (Transport_tax_Rate * total_Transport_expenses_WithoutGST) / 100;
  const final_Transport_expenses = total_Transport_expenses_WithoutGST + Transport_tax;

  const total_Product_Base_Price = billingData.reduce(
    (sum, item) => sum + Number(item.totalWithoutGST || 0),
    0
  );
  const total_GST_Amount = billingData.reduce((sum, item) => sum + Number(item.gst || 0), 0);
  const total_Product_Prize_includingGST = total_Product_Base_Price + total_GST_Amount;
  const total_Product_Price_includingGST_and_transport_expenses =
    total_Product_Prize_includingGST + final_Transport_expenses;

  const calculations = {
    total_weight,
    total_Transport_expenses_WithoutGST,
    Transport_tax,
    final_Transport_expenses,
    total_Product_Base_Price,
    total_GST_Amount,
    total_Product_Prize_includingGST,
    total_Product_Price_includingGST_and_transport_expenses,
    Transport_tax_Rate,
  };

  // States for modals and address
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [address, setAddress] = useState({
    shopName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  // Payment handler (unchanged)
  const handlePayment = async () => {
    const requiredFields = ["shopName", "addressLine1", "city", "state", "pincode", "country"];
    const isAddressComplete = requiredFields.every((field) => address[field].trim() !== "");
    if (!isAddressComplete) {
      alert("Please fill in all required address fields before proceeding.");
      setAddressModalVisible(true);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total_Product_Price_includingGST_and_transport_expenses * 100,
          currency: "INR",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.orderId) throw new Error("Failed to create payment order");

      const checkoutPage = `
        <html>
          <body>
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            <script>
              var options = {
                key: "${RAZORPAY_KEY_ID}",
                amount: ${total_Product_Price_includingGST_and_transport_expenses * 100},
                currency: "INR",
                order_id: "${data.orderId}",
                name: "BizStationery",
                description: "Order Payment",
                handler: function (response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify(response));
                },
                prefill: {
                  email: "${email || "customer@bizstationery.com"}",
                  contact: "${mobile || "+919876543210"}",
                  name: "${name || "Customer"}"
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
      console.error("Payment error:", error);
      alert("Oops! Couldn’t start payment: " + error.message);
    }
  };

  // Handle WebView payment response (with cart clearing)
  const handleWebViewMessage = async (event) => {
    try {
      const paymentInfo = JSON.parse(event.nativeEvent.data);
      if (paymentInfo.error) {
        setPaymentModalVisible(false);
        alert("Payment failed: " + paymentInfo.error.description);
        return;
      }
  
      const verifyResponse = await fetch(`${BASE_URL}payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: paymentInfo.razorpay_order_id,
          razorpay_payment_id: paymentInfo.razorpay_payment_id,
          razorpay_signature: paymentInfo.razorpay_signature,
          orderData: {
            retailer: {
              userId: userId || "662f3b1c9d8e4f2a1c3d5e7f", // Replace with a valid ObjectId from your Retailer collection
              name: name || "Unknown",
              contact: { mobile: mobile || "+919876543210", email: email || "unknown@biz.com" },
            },
            items: billingData.map((item) => ({
              productId: item.id, // Replace with valid Product ObjectId
              quantity: Number(item.quantity || 1),
              pricePerItem: Number(item.price || item.totalWithoutGST / item.quantity || 0),
              gstRate: Number(item.gst_rate || 5), // Ensure valid enum value
            })),
            totalAmount: total_Product_Price_includingGST_and_transport_expenses,
            amountBreakdown: {
              subtotal: total_Product_Base_Price,
              gst: total_GST_Amount,
              shipping: final_Transport_expenses,
            },
            address,
            orderStatus: "Pending", // Add explicitly
            payment: {
              method: "Card", // Use valid enum value (fetch from Razorpay if possible)
            },
          },
        }),
      });
      const result = await verifyResponse.json();
      console.log("Verify response:", result); // Debug
      if (result.success) {
        setPaymentModalVisible(false);
        // alert("Yay! Payment successful! Order ID: " + result.order.orderId);
        await generateInvoicePDF(billingData, address, {
          ...calculations,
          orderId: result.order.orderId,
        });
        dispatch(clearCart());
        console.log("Cart cleared after successful payment");
        navigation.navigate("Home");
      } else {
        alert("Payment verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Oops! Error saving order: " + error.message);
    }
  };

  // Invoice download (unchanged)
  const handleDownloadInvoice = async () => {
    console.log("Downloading invoice...");
    await generateInvoicePDF(billingData, address, calculations);
  };

  return (
    <ScrollView style={newStyles.container}>
      {/* Header */}
      <View style={newStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={newStyles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={newStyles.headerText}>Checkout</Text>
      </View>

      {/* Address Section */}
      <View style={newStyles.card}>
        <Text style={newStyles.sectionTitle}>Delivery Address</Text>
        <View style={newStyles.addressBox}>
          {address.shopName && address.addressLine1 ? (
            <Text style={newStyles.addressText}>
              {`${address.shopName}, ${address.addressLine1}, ${address.addressLine2 || ""}, ${address.city}, ${address.state} - ${address.pincode}, ${address.country}`}
            </Text>
          ) : (
            <Text style={newStyles.placeholderText}>Add your shipping address</Text>
          )}
          <TouchableOpacity
            style={newStyles.editButton}
            onPress={() => setAddressModalVisible(true)}
          >
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Address Modal */}
      <Modal animationType="fade" transparent={true} visible={addressModalVisible}>
        <View style={newStyles.modalOverlay}>
          <View style={newStyles.modalContent}>
            <Text style={newStyles.modalTitle}>Shipping Address</Text>
            <TextInput
              style={newStyles.input}
              placeholder="Shop Name *"
              placeholderTextColor="#888"
              value={address.shopName}
              onChangeText={(text) => setAddress({ ...address, shopName: text })}
            />
            <TextInput
              style={newStyles.input}
              placeholder="Address Line 1 *"
              placeholderTextColor="#888"
              value={address.addressLine1}
              onChangeText={(text) => setAddress({ ...address, addressLine1: text })}
            />
            <TextInput
              style={newStyles.input}
              placeholder="Address Line 2"
              placeholderTextColor="#888"
              value={address.addressLine2}
              onChangeText={(text) => setAddress({ ...address, addressLine2: text })}
            />
            <View style={newStyles.inputRow}>
              <TextInput
                style={[newStyles.input, newStyles.halfInput]}
                placeholder="City *"
                placeholderTextColor="#888"
                value={address.city}
                onChangeText={(text) => setAddress({ ...address, city: text })}
              />
              <TextInput
                style={[newStyles.input, newStyles.halfInput]}
                placeholder="State *"
                placeholderTextColor="#888"
                value={address.state}
                onChangeText={(text) => setAddress({ ...address, state: text })}
              />
            </View>
            <View style={newStyles.inputRow}>
              <TextInput
                style={[newStyles.input, newStyles.halfInput]}
                placeholder="Pincode *"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={address.pincode}
                onChangeText={(text) => setAddress({ ...address, pincode: text })}
              />
              <TextInput
                style={[newStyles.input, newStyles.halfInput]}
                placeholder="Country *"
                placeholderTextColor="#888"
                value={address.country}
                onChangeText={(text) => setAddress({ ...address, country: text })}
              />
            </View>
            <TouchableOpacity
              style={newStyles.saveButton}
              onPress={() => setAddressModalVisible(false)}
            >
              <Text style={newStyles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={newStyles.cancelButton}
              onPress={() => setAddressModalVisible(false)}
            >
              <Text style={newStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Invoice Preview */}
      <View style={newStyles.card}>
        <TouchableOpacity
          style={newStyles.previewButton}
          onPress={() => setInvoiceModalVisible(true)}
        >
          <Text style={newStyles.previewText}>Preview Invoice</Text>
        </TouchableOpacity>
      </View>

      {/* Invoice Modal */}
      <Modal animationType="fade" transparent={true} visible={invoiceModalVisible}>
        <View style={newStyles.modalOverlay}>
          <View style={newStyles.modalContent}>
            <Text style={newStyles.modalTitle}>Invoice Details</Text>
            <ScrollView>
              {/* Products Table */}
              <View style={newStyles.table}>
                <View style={newStyles.tableHeader}>
                  <Text style={[newStyles.tableCell, { flex: 2 }]}>Item</Text>
                  <Text style={[newStyles.tableCell, { flex: 1 }]}>Price</Text>
                  <Text style={[newStyles.tableCell, { flex: 1 }]}>GST</Text>
                </View>
                {billingData.map((item, index) => (
                  <View key={index} style={newStyles.tableRow}>
                    <Text style={[newStyles.tableCell, { flex: 2 }]}>{item.name}</Text>
                    <Text style={[newStyles.tableCell, { flex: 1 }]}>
                      ₹{Number(item.price || 0).toFixed(2)}
                    </Text>
                    <Text style={[newStyles.tableCell, { flex: 1 }]}>{item.gst_rate}%</Text>
                  </View>
                ))}
              </View>

              {/* Breakdown */}
              <Text style={newStyles.sectionTitle}>Summary</Text>
              <View style={newStyles.breakdownRow}>
                <Text>Base Price</Text>
                <Text>₹{total_Product_Base_Price.toFixed(2)}</Text>
              </View>
              <View style={newStyles.breakdownRow}>
                <Text>GST</Text>
                <Text>₹{total_GST_Amount.toFixed(2)}</Text>
              </View>
              <View style={newStyles.breakdownRow}>
                <Text>Subtotal</Text>
                <Text>₹{total_Product_Prize_includingGST.toFixed(2)}</Text>
              </View>
              <View style={newStyles.breakdownRow}>
                <Text>Shipping (₹120/kg)</Text>
                <Text>₹{total_Transport_expenses_WithoutGST.toFixed(2)}</Text>
              </View>
              <View style={newStyles.breakdownRow}>
                <Text>Shipping Tax (5%)</Text>
                <Text>₹{Transport_tax.toFixed(2)}</Text>
              </View>
              <View style={newStyles.totalRow}>
                <Text style={newStyles.totalLabel}>Total</Text>
                <Text style={newStyles.totalAmount}>
                  ₹{total_Product_Price_includingGST_and_transport_expenses.toFixed(2)}
                </Text>
              </View>

              {/* Buttons */}
              <View style={newStyles.modalButtons}>
                <TouchableOpacity
                  style={newStyles.closeButton}
                  onPress={() => setInvoiceModalVisible(false)}
                >
                  <Text style={newStyles.buttonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={newStyles.downloadButton}
                  onPress={handleDownloadInvoice}
                >
                  <Text style={newStyles.buttonText}>Download</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payment Button */}
      <TouchableOpacity style={newStyles.paymentButton} onPress={handlePayment}>
        <Text style={newStyles.paymentButtonText}>Pay Now</Text>
      </TouchableOpacity>

      {/* WebView */}
      <Modal visible={paymentModalVisible} animationType="slide">
        <WebView source={{ uri: paymentUrl }} onMessage={handleWebViewMessage} style={{ flex: 1 }} />
        <TouchableOpacity
          style={newStyles.webViewCloseButton}
          onPress={() => setPaymentModalVisible(false)}
        >
          <Text style={newStyles.buttonText}>Cancel Payment</Text>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default ProceedOrder;