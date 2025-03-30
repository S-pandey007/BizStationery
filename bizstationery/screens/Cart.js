import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../style/CartStyle";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity, removeFromCart } from "../redux/slice/cartSlice";
import { addToSavedItems, removeFromSavedItems } from "../redux/slice/savedItemsSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ToastAndroid } from "react-native";
import { addToCart, updateQuantity } from "../redux/slice/cartSlice";


const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const savedItems = useSelector((state) => state.savedItems.items) || [];
  const [eachItemCost, setEachItemCost] = useState([]);
  const [orderDetailModal, setOrderDetailModal] = useState(false);

  const calculatePrice = () => {
    const updatedCosts = cartItems.map((item) => {
      const totalWithoutGST = item.price * item.quantity;
      const gst = (totalWithoutGST * (item.gst_rate || 0)) / 100;
      const finalPrice = totalWithoutGST + gst;

      return {
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        totalWithoutGST,
        gst_rate: item.gst_rate || 0,
        gst,
        finalPrice,
        name: item.product_name,
        // weight: item.weight,
        hsn_code: item.hsn_code,
        variant: item.variant || {},
      };
    });
    setEachItemCost(updatedCosts);
  };

  useEffect(() => {
    calculatePrice();
    // console.log("CartScreen - cartItems:", cartItems);
  }, [cartItems]);

  const totalOrderPrice = eachItemCost.reduce((acc, item) => acc + item.finalPrice, 0);

  const handleIncreaseQuantity = (id) => {
    dispatch(increaseQuantity({ id }));
    ToastAndroid.show("Quantity increased by 25", ToastAndroid.SHORT);
  };

  const handleDecreaseQuantity = (id) => {
    dispatch(decreaseQuantity({ id }));
    ToastAndroid.show("Quantity decreased by 25", ToastAndroid.SHORT);
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    ToastAndroid.show("Item removed from cart", ToastAndroid.SHORT);
  };

  const handleSaveForLater = (item) => {
    dispatch(
      addToSavedItems({
        id: item.id,
        product_name: item.product_name,
        price: item.price,
        image_link: item.image_link,
        variant: item.variant,
        quantity: item.quantity,
      })
    );
    dispatch(removeFromCart(item.id));
    ToastAndroid.show("Saved for later", ToastAndroid.SHORT);
  };

  const handleMoveToCart = (item) => {
    dispatch(
      addToCart({
        id: item.id,
        product_name: item.product_name,
        price: item.price,
        image_link: item.image_link,
        variant: item.variant,
        quantity: item.quantity,
        stock_quantity: item.stock_quantity,
        weight: item.weight,
        gst_rate: item.gst_rate,
        hsn_code: item.hsn_code,
      })
    );
    dispatch(removeFromSavedItems({ id: item.id, variantQuality: item.variant?.quality }));
    ToastAndroid.show("Moved to cart", ToastAndroid.SHORT);
  };

  const handleRemoveFromSaved = (item) => {
    dispatch(removeFromSavedItems({ id: item.id, variantQuality: item.variant?.quality }));
    ToastAndroid.show("Removed from saved items", ToastAndroid.SHORT);
  };

  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Cart</Text>
        </View>
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart and saved items are empty.</Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <View style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
      <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}</Text>
      <Text style={[styles.tableCell, { flex: 3 }]}>
        {item.name} {item.variant?.quality ? `(${item.variant.quality})` : ""}
      </Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.price.toFixed(2)}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.quantity}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.gst_rate}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.finalPrice.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cart</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.length > 0 && (
          <>
            {cartItems.map((item) => {
              const key = `${item.id}-${item.variant?.quality || "default"}`;
              return (
                <View key={key} style={styles.productItem}>
                  <Image source={{ uri: item.image_link }} style={styles.productImage} />
                  <View style={styles.productDetails}>
                    <TouchableOpacity
                      onPress={() => {
                        console.log("Navigating to ProductDetail with id:", item.id);
                        navigation.navigate("ProductDetail", { product: item.id });
                      }}
                    >
                      <Text style={styles.productName}>
                        {item.product_name} {item.variant?.quality ? `(${item.variant.quality})` : ""}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.productPrice}>₹{item.price.toFixed(2)}</Text>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleDecreaseQuantity(item.id)}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleIncreaseQuantity(item.id)}
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
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => handleSaveForLater(item)}
                    >
                      <Text style={styles.saveButtonText}>Save for Later</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ProductCustomization", { id: item.id,orderId: undefined })}
                      style={styles.saveButton}
                    >
                      <Text style={styles.saveButtonText}>Customization</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Check Out Order Detail</Text>
                <TouchableOpacity
                  onPress={() => {
                    setOrderDetailModal(true)
                    calculatePrice();
                  }}
                  style={styles.summaryValue}
                >
                  <AntDesign name="caretdown" size={20} color="#6B48FF" />
                </TouchableOpacity>
              </View>
              <View style={styles.summaryTotal}>
                <Text style={styles.summaryTotalLabel}>Order Total:</Text>
                <Text style={styles.summaryTotalValue}>₹{totalOrderPrice.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProceedOrder", { billingData: eachItemCost })}
                style={styles.proceedButton}
              >
                <Text style={styles.proceedButtonText}>
                  Proceed to Buy ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})
                </Text>
              </TouchableOpacity>
              <View style={styles.InfoContainer}>
                <Text style={styles.infoText}>
                  Transport expenses and transport tax are not yet added to the total amount.
                </Text>
              </View>
            </View>
          </>
        )}

        {savedItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Saved for Later</Text>
            {savedItems.map((item) => (
              <View
                key={`${item.id}-${item.variant?.quality || "default"}`}
                style={styles.productItem}
              >
                <Image source={{ uri: item.image_link }} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>
                    {item.product_name} {item.variant?.quality ? `(${item.variant.quality})` : ""}
                  </Text>
                  <Text style={styles.productPrice}>₹{item.price.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleMoveToCart(item)}
                  >
                    <Text style={styles.saveButtonText}>Move to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveFromSaved(item)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <Modal
        visible={orderDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOrderDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setOrderDetailModal(false)}>
                <AntDesign name="close" size={20} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 1 }]}>S.No</Text>
              <Text style={[styles.tableHeader, { flex: 3 }]}>Product Name</Text>
              <Text style={[styles.tableHeader, { flex: 2 }]}>Price (₹)</Text>
              <Text style={[styles.tableHeader, { flex: 1 }]}>Qty</Text>
              <Text style={[styles.tableHeader, { flex: 1 }]}>GST (%)</Text>
              <Text style={[styles.tableHeader, { flex: 2 }]}>Total (₹)</Text>
            </View>
            <FlatList
              data={eachItemCost}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.id}-${item.variant?.quality || "default"}`}
              style={styles.tableContainer}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CartScreen;