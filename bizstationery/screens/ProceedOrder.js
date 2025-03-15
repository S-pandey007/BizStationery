import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons
import styles from "../style/ProceedOrderStyle";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import generateInvoicePDF from "../utils/generateInvoicePDF";


const ProceedOrder = ({ route }) => {
  
  
  const navigation = useNavigation();
  const billingData = route.params.billingData;
  console.log("billingData : ", billingData);

  // Logic behind Transport expenses and transport tax
  // Transport expenses 120 Rs/kg, weights in grams, convert to kg
  // Transport tax 5%

  // Calculate total order weight in grams, then convert to kg
  const Total_OrderWeight_InGrams = billingData.map((item) => {
    const weightInGrams = Number(item.variant.weight || 0); // Weight in grams
    const quantity = Number(item.quantity || 0);
    const per_item_total_weight = weightInGrams * quantity;
    console.log(`Item: ${item.name}, Weight (g): ${weightInGrams}, Quantity: ${quantity}, Total (g): ${per_item_total_weight}`);
    return per_item_total_weight;
  });
  console.log("Total Order Weight per item (grams):", Total_OrderWeight_InGrams);

  const total_weight_in_grams = Total_OrderWeight_InGrams.reduce((x, y) => x + y, 0);
  const total_weight = total_weight_in_grams / 1000; // Convert grams to kilograms
  console.log("Total weight (kg):", total_weight);

  const Transport_expenses_PerKG = 120; // Rs per kg
  const total_Transport_expenses_WithoutGST = Transport_expenses_PerKG * total_weight;
  console.log("Without GST (Rs):", total_Transport_expenses_WithoutGST);

  const Transport_tax_Rate = 5; // 5% GST
  const Transport_tax = (Transport_tax_Rate * total_Transport_expenses_WithoutGST) / 100;
  console.log("Tax amount on transport (Rs):", Transport_tax);

  const final_Transport_expenses = total_Transport_expenses_WithoutGST + Transport_tax;
  console.log("Final Transport expenses (Rs):", final_Transport_expenses);

  // Product price calculation (unchanged except for numeric safety)
  const total_Product_Base_Price_Array = billingData.map((item) => Number(item.totalWithoutGST || 0));
  const total_Product_Base_Price = total_Product_Base_Price_Array.reduce((x, y) => x + y, 0);
  console.log("All product Base price (Rs):", total_Product_Base_Price);

  const all_Product_GST_Amount_Array = billingData.map((item) => Number(item.gst || 0));
  const total_GST_Amount = all_Product_GST_Amount_Array.reduce((x, y) => x + y, 0);
  console.log("Total GST Amount (Rs):", total_GST_Amount);

  const total_Product_Prize_includingGST = total_Product_Base_Price + total_GST_Amount;
  console.log("Total Product Prize including GST (Rs):", total_Product_Prize_includingGST);

  const total_Product_Price_includingGST_and_transport_expenses =
    total_Product_Prize_includingGST + final_Transport_expenses;
  console.log(
    "Total Product Price including GST and transport expenses (Rs):",
    total_Product_Price_includingGST_and_transport_expenses
  );

  // Prepare all calculations to pass to the PDF generator
  const calculations = {
    total_weight, // In kg
    total_Transport_expenses_WithoutGST,
    Transport_tax,
    final_Transport_expenses,
    total_Product_Base_Price,
    total_GST_Amount,
    total_Product_Prize_includingGST,
    total_Product_Price_includingGST_and_transport_expenses,
    Transport_tax_Rate,
  };

  // State for modals and address (unchanged)
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [address, setAddress] = useState({
    shopName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  // Function to trigger the PDF download (unchanged)
  const handleDownloadInvoice = async() => {
    console.log("generateInvoicePDF called");
    await generateInvoicePDF(billingData, address, calculations);
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AntDesign
          onPress={() => navigation.goBack()}
          name="arrowleft"
          size={24}
          color="black"
        />
        <Text style={styles.headerText}>Proceed Order</Text>
      </View>

      {/* Address Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.addressContainer}>
          {address.shopName &&
          address.addressLine1 &&
          address.addressLine2 &&
          address.city &&
          address.state &&
          address.pincode &&
          address.country ? (
            <Text
              style={styles.addressText}
            >{`${address.shopName}, ${address.addressLine1}, ${address.addressLine2}, ${address.city}, ${address.state}, ${address.pincode}, ${address.country}`}</Text>
          ) : (
            <Text style={styles.placeholderText}>No address added</Text>
          )}
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => setAddressModalVisible(true)}
          >
            <Icon name="edit" size={20} color="#6B48FF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Shipping Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Shop Name"
              placeholderTextColor="#888"
              value={address.shopName}
              onChangeText={(text) =>
                setAddress({ ...address, shopName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Address Line 1"
              placeholderTextColor="#888"
              value={address.addressLine1}
              onChangeText={(text) =>
                setAddress({ ...address, addressLine1: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Address Line 2 (Optional)"
              placeholderTextColor="#888"
              value={address.addressLine2}
              onChangeText={(text) =>
                setAddress({ ...address, addressLine2: text })
              }
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="City"
                placeholderTextColor="#888"
                value={address.city}
                onChangeText={(text) => setAddress({ ...address, city: text })}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="State"
                placeholderTextColor="#888"
                value={address.state}
                onChangeText={(text) => setAddress({ ...address, state: text })}
              />
            </View>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Postal Code"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={address.pincode}
                onChangeText={(text) =>
                  setAddress({ ...address, pincode: text })
                }
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Country"
                placeholderTextColor="#888"
                value={address.country}
                onChangeText={(text) =>
                  setAddress({ ...address, country: text })
                }
              />
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                // Simulate saving address (replace with actual logic if needed)
                console.log("Address saved:", address);

                setAddressModalVisible(false);
              }}
            >
              <Text style={styles.saveButtonText}>Save Address</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setAddressModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* View Invoice Button */}
      <TouchableOpacity
        style={styles.viewInvoiceButton}
        onPress={() => setInvoiceModalVisible(true)}
      >
        <Text style={styles.viewInvoiceText}>View Invoice</Text>
      </TouchableOpacity>

      {/* Invoice Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={invoiceModalVisible}
        onRequestClose={() => setInvoiceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Invoice Details</Text>
            <ScrollView showsVerticalScrollIndicator={false}>

              {/* Products List */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    { flex: 2, textAlign: "center" },
                  ]}
                >
                  Products
                </Text>
                <Text
                  style={[
                    styles.sectionTitle,
                    { flex: 1, textAlign: "center" },
                  ]}
                >
                  Price
                </Text>
                <Text
                  style={[
                    styles.sectionTitle,
                    { flex: 1, textAlign: "center" },
                  ]}
                >
                  GST Rate
                </Text>
              </View>
              {billingData.map((item,index) => (
                <ScrollView key={index} style={styles.invoiceSection} showsVerticalScrollIndicator={false}>
                  <View style={styles.productItem}>
                    <Text style={{ flex: 2, textAlign: "center" }}>
                      {item.name}
                    </Text>
                    <Text style={{ flex: 1, textAlign: "center" }}>
                      ₹{item.price}
                    </Text>
                    <Text style={{ flex: 1, textAlign: "center" }}>
                      {item.gst_rate}%
                    </Text>
                  </View>
                </ScrollView>
              ))}

              {/* Amount Breakdown */}
              <ScrollView style={styles.invoiceSection} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Amount Breakdown</Text>
                <Text style={styles.sectionSubTitle}>Product Price & Tax</Text>
                <View style={styles.breakdownRow}>
                  <Text>All Products Base Price</Text>
                  <Text>₹{total_Product_Base_Price}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text>GST Amount</Text>
                  <Text>₹{total_GST_Amount}</Text>
                </View>
                <View
                  style={[
                    styles.breakdownRow,
                    { borderTopWidth: 1, borderBottomColor: "#E0E0E0", top: 5 },
                  ]}
                >
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Total Amount
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    ₹{total_Product_Prize_includingGST}
                  </Text>
                </View>
                {/* <View style={styles.breakdownRow}>
                  <Text>Transport Tax (5%)</Text>
                  <Text>$1.00</Text>
                </View> */}

                <Text style={[styles.sectionSubTitle, { top: 10 }]}>
                  Transportation Cost & Tax
                </Text>

                <View style={styles.breakdownRow}>
                  <Text>Total Order Weight</Text>
                  <Text>{total_weight}Kg</Text>
                </View>

                <View style={styles.breakdownRow}>
                  <Text>Amount Weight per Kg</Text>
                  <Text>₹{Transport_expenses_PerKG}/Kg</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text>Transport Weight expenses</Text>
                  <Text>₹{total_Transport_expenses_WithoutGST}</Text>
                </View>

                <View style={styles.breakdownRow}>
                  <Text>Transport Tax</Text>
                  <Text>{Transport_tax_Rate}%</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text>Transport Tax Amount</Text>
                  <Text>₹{Transport_tax}</Text>
                </View>

                <View
                  style={[
                    styles.breakdownRow,
                    { borderTopWidth: 1, borderBottomColor: "#E0E0E0", top: 5 },
                  ]}
                >
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  Transport Expenses
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    ₹{final_Transport_expenses}
                  </Text>
                </View>
                
              </ScrollView>

              {/* Total Amount */}
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>₹{total_Product_Price_includingGST_and_transport_expenses}</Text>
              </View>

              {/* Modal Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.closeButton]}
                  onPress={() => setInvoiceModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.downloadButton]}
                  onPress={handleDownloadInvoice}
                >
                  <Text style={styles.modalButtonText}>Download Invoice</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payment Methods Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <TouchableOpacity style={styles.paymentOption}>
          <Icon name="credit-card" size={24} color="#6B48FF" />
          <Text style={styles.paymentText}>Credit/Debit Card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption}>
          <Icon name="account-balance-wallet" size={24} color="#6B48FF" />
          <Text style={styles.paymentText}>UPI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption}>
          <Icon name="money" size={24} color="#6B48FF" />
          <Text style={styles.paymentText}>Cash on Delivery</Text>
        </TouchableOpacity>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity style={styles.proceedButton}>
        <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProceedOrder;
