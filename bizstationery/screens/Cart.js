import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import styles from '../style/CartStyle'; // Import styles from the separate file

const CartScreen = () => {
  // Dummy product data for the cart (initially with 2 items)
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'iQOO Z9 5G (Brushed Green, 8GB RAM, 128GB Storage)',
      price: 18499.00,
      originalPrice: 24999.00,
      image: 'https://via.placeholder.com/150', // Replace with actual product image
      quantity: 1,
      color: 'Brushed Green',
      size: '8GB RAM, 128GB Storage',
      inStock: true,
    },
    {
      id: '2',
      name: 'realme GT 7 Pro (Galaxy Grey, 12GB+256GB) | India',
      price: 54998.00,
      originalPrice: 69999.00,
      image: 'https://via.placeholder.com/150', // Replace with actual product image
      quantity: 1,
      color: 'Galaxy Grey',
      size: '12GB+256GB',
      inStock: true,
    },
  ]);

  // Handle quantity change (increase/decrease)
  const handleQuantityChange = (id, type) => {
    setCartItems(cartItems.map(item =>
      item.id === id
        ? {
            ...item,
            quantity: type === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
          }
        : item
    ));
  };

  // Handle item removal
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxes = subtotal * 0.18; // Assuming 18% GST for simplicity
  const deliveryCharges = 158.00; // Fixed delivery charge as per the screenshot
  const orderTotal = subtotal + taxes + deliveryCharges;

  // Render empty cart message or product list
  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Cart</Text>
        </View>
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>No products added to your cart.</Text>
        </View>
      </View>
    );
  }

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
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                ₹{item.price.toFixed(2)} <Text style={styles.originalPrice}>M.R.P.: ₹{item.originalPrice.toFixed(2)}</Text>
              </Text>
              <Text style={styles.productMeta}>Colour: {item.color} | Size: {item.size}</Text>
              <Text style={styles.productStatus}>
                {item.inStock ? 'In stock' : 'Out of stock'}
              </Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item.id, 'decrease')}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item.id, 'increase')}
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
            </View>
          </View>
        ))}

        {/* Cart Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Items:</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Delivery:</Text>
            <Text style={styles.summaryValue}>₹{deliveryCharges.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryValue}>₹{(subtotal + deliveryCharges).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Promotion Applied:</Text>
            <Text style={styles.summaryValue}>-₹{taxes.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Order Total:</Text>
            <Text style={styles.summaryTotalValue}>₹{orderTotal.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.proceedButton}>
            <Text style={styles.proceedButtonText}>Proceed to Buy ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</Text>
          </TouchableOpacity>
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
            <Text style={styles.savedCategoryText}>Notebook computer stan...</Text>
          </View>
          <View style={styles.savedCategory}>
            <Text style={styles.savedCategoryText}>Laptops (1)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CartScreen;