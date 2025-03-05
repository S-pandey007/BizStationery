import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Pressable,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import styles from "../style/ProductDetailStyle"; // Import styles from the separate file
import { useNavigation } from '@react-navigation/native';
import {useDispatch,useSelector} from 'react-redux'
import { addToCart } from "../redux/slice/cartSlice";


const ProductDetail = ({ route }) => {
  // Sample product data (replace with real data from API or props)
  const id = route.params.product;
  console.log(id);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems= useSelector((state)=> state.cart.items)

  const [product, setProduct] = useState(); // Initialize as null to handle undefined
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(`http://192.168.43.3:5000/api/products/${id}`);
        const data = await response.json();
        console.log("data from API", data.product);
        setProduct(data.product);
        console.log( product.bulk_discount.min_quantity);
        
      } catch (error) {
        console.log("Something going wrong, data not fetched from API", error);
        // Alert.alert('Error', 'Failed to load product. Please try again.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [id]); // Add id as dependency to refetch if it changes

  // check if product is in cart
  const isInCart = cartItems.some((item)=> item.id === id)


  // State for quantity and cart
  const [quantity, setQuantity] = useState(25); // Start with MOQ to simplify initial bulk order
  const [inCart, setInCart] = useState(false);

  // Determine stock status color and text (only if product exists)
  const getStockStatus = () => {
    if (!product) return { text: "Loading...", color: "#666" }; // Default while loading
    if (product.stock_quantity >= 50) {
      return { text: "In Stock", color: "#4CAF50" }; // Green
    } else if (product.stock_quantity > 0 && product.stock_quantity < 50) {
      return { text: "Low Stock", color: "#FFCA28" }; // Yellow
    } else {
      return { text: "Out of Stock", color: "#FF4D4D" }; // Red
    }
  };

  // Handle quantity decrement with MOQ (50) and step of 25
  const decreaseQuantity = () => {
    if (!product) return;
    if (quantity<25) return 
    setQuantity(quantity - 25);
  };

  // Handle quantity increment with stock limit and step of 25
  const increaseQuantity = () => {
    if (!product) return; // Prevent action if product is not loaded
    setQuantity(quantity + 25);
  };

  // Handle adding to cart with MOQ validation
  const handleAddToCart = () => {
    if (!product) return; // Prevent action if product is not loaded
    const stockStatus = getStockStatus();
    if (stockStatus.text === "Out of Stock") {
      Alert.alert("Error", "This product is out of stock.");
      return;
    }

    // dispatch action to add to cart
    dispatch(
      addToCart({
        id: product.id,
        product_name:product.product_name,
        price: product.price,
        image_link : product.image_link,
        quantity,
        stock_quantity:product.stock_quantity,
        weight:product.weight,
        gst_rate: product.gst_rate,
      })
    )

    setInCart(true)
  };


  const stockStatus = getStockStatus();

  // Render loading or product details
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B48FF" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Product Details</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Slider */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageSlider}
        >
          
            <Image
              source={{ uri: product.image_link }}
              style={styles.productImage}
            />
        
        </ScrollView>

        {/* Product Information */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.product_name}</Text>
          <Text style={styles.productBrand}>Brand: {product.brand}</Text>
          <Text style={styles.productPrice}>
            {`Rs.${product.price}`}
            {/* {quantity >= product.bulk_discount.min_quantity && (
              <Text style={styles.discountText}>
                (Save {product.bulk_discount.discount_percent}% on bulk order)
              </Text>
            )} */}
          </Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          <View style={styles.productDetails}>
            <Text>Weight: {product.weight} kg</Text>
            <Text>Category: {product.category}</Text>
            <Text>Seller Location: {product.seller_state}</Text>
            <Text style={[styles.stockStatus, { color: stockStatus.color }]}>
              {stockStatus.text}
            </Text>
          </View>

          {/* Bulk Order Message */}
          {/* <Text style={styles.bulkMessage}>
            This product is available only if you order at least{" "}
            {product.bulk_discount.min_quantity} items.
          </Text> */}

          {/* Ratings & Reviews */}
          <View style={styles.ratings}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews} reviews)
            </Text>
          </View>

          <View style={styles.quantityContainer}>
            <Pressable
              style={styles.quantityButton}
              onPress={decreaseQuantity}
              disabled={
                // quantity <= product.bulk_discount.min_quantity ||
                stockStatus.text === "Out of Stock"
              }
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </Pressable>
            <Text style={styles.quantityText}>{quantity}</Text>
            <Pressable
              style={styles.quantityButton}
              onPress={increaseQuantity}
              disabled={
                // quantity + 25 > product.stock_quantity ||
                stockStatus.text === "Out of Stock"
              }
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>
          <TouchableOpacity
            style={[styles.addToCartButton, inCart && styles.inCartButton]}
            onPress={handleAddToCart}
            disabled={inCart || stockStatus.text === "Out of Stock"}
          >
            <Text style={styles.addToCartText}>
              {inCart ? "Added to Cart" : "Add to Cart"}
            </Text>
          </TouchableOpacity>

          {/* Customization Request Button */}
          <TouchableOpacity
            style={styles.customizeButton}
            onPress={()=> navigation.navigate('ProductCustomization',{id:product.id})}
            disabled={stockStatus.text === "Out of Stock"}
          >
            <Text style={styles.customizeText}>Request Customization</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetail;