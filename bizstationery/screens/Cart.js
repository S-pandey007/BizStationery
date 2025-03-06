import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import styles from '../style/CartStyle'; // Import styles from the separate file
import { useNavigation } from '@react-navigation/native';
import {useSelector,useDispatch} from 'react-redux'
import {updateQuantity,removeFromCart} from '../redux/slice/cartSlice'
import AntDesign from '@expo/vector-icons/AntDesign';

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [eachItemCost, setEachItemCost] = useState([]);
  const [orderDetailModal, setOrderDetailModal] = useState(false);
  
  // Handle quantity change (increase/decrease)
  const handleQuantityChange = (id, type) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      const newQuantity =
        type === "increase"
          ? item.quantity + 25
          : Math.max(25, item.quantity - 25);
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  // Handle item removal
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  // Calculate totals
  // const subtotal = cartItems.reduce(
  //   (total, item) => total + item.price * item.quantity,
  //   0
  // );console.log("subtotal : ", subtotal);
  

  // const taxes = subtotal * 0.18; // Assuming 18% GST for simplicity
  // const deliveryCharges = 158.0; // Fixed delivery charge as per the screenshot
  // const orderTotal = subtotal + taxes + deliveryCharges;

  // Render empty cart message or product list
  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Cart</Text>
        </View>
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>
            No products added to your cart.
          </Text>
        </View>
      </View>
    );
  }

  // prize calculation 
  // console.log(cartItems);
  

const calculatePrize = () => {
  const updatedCosts = cartItems.map((item) => {
    const totalWithOutGST = item.price * item.quantity;
    const GST = (totalWithOutGST * item.gst_rate) / 100;
    const FinalPrize = totalWithOutGST + GST;

    console.log(
      `Item Base price: ${item.price} * Item quantity: ${item.quantity} = ${totalWithOutGST}`
    );
    console.log("totalWithOutGST each item total amount is:", totalWithOutGST);
    console.log(`${item.gst_rate}% of ${totalWithOutGST} is ${GST}`);
    console.log("Final product Prize including GST is:", FinalPrize);

    return {
      price: item.price,
      quantity: item.quantity,
      totalWithOutGST,
      gst_rate: item.gst_rate,
      GST,
      FinalPrize,
      name: item.product_name,
      weight: item.weight,
    };
  });

  setEachItemCost(updatedCosts);
};
useEffect(() => {
  calculatePrize();
}, [cartItems]); // Only re-run when cartItems changes

console.log("eachItemCost :", eachItemCost);
const totalOrderPrize = eachItemCost.reduce((acc, item) => acc + item.FinalPrize, 0);
console.log("totalOrderPrize :", totalOrderPrize);

  

const renderItem = ({ item, index }) => {
  return (
    <View
      style={[
        styles.tableRow ,index % 2 === 0 ?  styles.evenRow: styles.oddRow]}
    >
      <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}</Text>
        <Text style={[styles.tableCell, { flex: 3 }]}>{item.name}</Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>{item.price.toFixed(2)}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{item.quantity}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{item.gst_rate}</Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>{item.FinalPrize.toFixed(2)}</Text>

    </View>
  );
};

return (
  <View style={styles.container}>
    {/* Fixed Header (outside ScrollView) */}
    <View style={styles.header}>
      <Text style={styles.headerText}>Cart</Text>
    </View>

    {/* Scrollable Content */}
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Products List */}
      {cartItems.map((item) => (
        <View key={item.id} style={styles.productItem}>
          <Image
            source={{ uri: item.image_link }}
            style={styles.productImage}
          />
          <View style={styles.productDetails}>
            <Text
              onPress={() =>
                navigation.navigate("ProductDetail", { product: item.id })
              }
              style={styles.productName}
            >
              {item.product_name}
            </Text>
            <Text style={styles.productPrice}>
              {/* ₹{item.price.toFixed(2)} */}₹{item.price}
              {/* <Text style={styles.originalPrice}>
                  M.R.P.: ₹{item.originalPrice.toFixed(2)}
                </Text> */}
            </Text>
            {/* <Text style={styles.productMeta}>
                Colour: {item.color} | Size: {item.size}
              </Text> */}
            {/* <Text style={styles.productStatus}>
                {item.inStock ? "In stock" : "Out of stock"}
              </Text> */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, "decrease")}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, "increase")}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <Text style={styles.removeButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save for later</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductCustomization", { id: item.id })
              }
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Customization</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Cart Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Check Out Order Detail</Text>
          <Pressable
            onPress={() => setOrderDetailModal(true)}
            style={styles.summaryValue}
          >
            <AntDesign name="caretdown" size={20} color="#6B48FF" />
          </Pressable>
        </View>
        <View style={styles.summaryTotal}>
          <Text style={styles.summaryTotalLabel}>Order Total:</Text>
          <Text style={styles.summaryTotalValue}>
            ₹{totalOrderPrize.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
        onPress={() => navigation.navigate("ProceedOrder",{billingData:eachItemCost})}
        style={styles.proceedButton}>
          <Text style={styles.proceedButtonText}>
            Proceed to Buy ({cartItems.length} item
            {cartItems.length > 1 ? "s" : ""})
          </Text>
        </TouchableOpacity>
        <View style={styles.InfoContainer}>
          <Text style={styles.infoText}>
          Transport expenses and transport tax are not yet added to the total amount. 
          {/* The final cost may change once these charges are included. */}
          </Text>
        </View>
      </View>

      {/* Saved for Later Section (Placeholder) */}
      <View style={styles.savedSection}>
        <Text style={styles.savedTitle}>Saved for Later (4 items)</Text>
        <View style={styles.savedCategory}>
          <Text style={styles.savedCategoryText}>Smartphones & basic...</Text>
        </View>
        <View style={styles.savedCategory}>
          <Text style={styles.savedCategoryText}>Mouse pads (1)</Text>
        </View>
        <View style={styles.savedCategory}>
          <Text style={styles.savedCategoryText}>
            Notebook computer stan...
          </Text>
        </View>
        <View style={styles.savedCategory}>
          <Text style={styles.savedCategoryText}>Laptops (1)</Text>
        </View>
      </View>
    </ScrollView>

    <Modal
      visible={orderDetailModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setOrderDetailModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header  */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order Details</Text>
            <TouchableOpacity onPress={() => setOrderDetailModal(false)}>
              <AntDesign name="close" size={20} color="#6B48FF" />
            </TouchableOpacity>
          </View>

          {/* Table  */}
          {/* table header  */}

          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { flex: 2 }]}>S.No</Text>
            <Text style={[styles.tableHeader, { flex: 3 }]}>Product Name</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>Price (₹)</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>Qty</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>GST (%)</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>Total (₹)</Text>
          </View>
          <ScrollView style={styles.tableContainer}>
            <FlatList
              data={eachItemCost}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  </View>
);
};

export default CartScreen;