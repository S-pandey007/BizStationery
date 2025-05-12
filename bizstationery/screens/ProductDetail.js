import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../redux/slice/cartSlice";
import styles from "../style/ProductDetailStyle";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");
// const BASE_URL = "http://192.168.245.3:8001";
import   Constant from 'expo-constants'
const BASE_URL = Constant.expoConfig.extra.API_URL;
console.log(BASE_URL)

const ProductDetail = ({ route }) => {
  const { product: id } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems) || [];

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(25);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}product/${id}`);
        const data = await response.json();
        // console.log("product", data.product._id);
        setProduct(data.product);
        setSelectedVariant(data.product.variants ? data.product.variants[0] : null);
        // console.log("product sate", product._id);
      } catch (error) {
        console.log("Error fetching data:", error);
        // Alert.alert("Error", "Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const isInCart = cartItems.some((item)=> item.id === id)
  

  console.log("isInCart:", isInCart);

  const getStockStatus = (stock) => {
    if (stock >= 50) return { text: "In Stock", color: "#28a745" };
    if (stock > 0) return { text: "Low Stock", color: "#FFCA28" };
    return { text: "Out of Stock", color: "#dc3545" };
  };

  const decreaseQuantity = () => {
    if (quantity <= 25) return;
    setQuantity(quantity - 25);
  };

  const increaseQuantity = () => {
    const maxStock = selectedVariant?.stock || product?.stock_quantity;
    const cartItem = cartItems.find(
      (item) =>
        item.id === id &&
        (item.variant?.quality || "default") === (selectedVariant?.attributes.quality || "default")
    );
    if (!maxStock || (cartItem?.quantity || 0) + quantity + 25 > maxStock) return;
    setQuantity(quantity + 25);
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    const stockStatus = getStockStatus(selectedVariant?.stock || product.stock_quantity);
    if (stockStatus.text === "Out of Stock") {
      Alert.alert("Error", "This product is out of stock.");
      return;
    }
  
    // Log product to debug
    console.log("Product before addToCart:", product);
  
    // // Use product._id if id is missing
    // const productId = product.id || product._id || id; // Fallback to route.params.id
    // console.log("Product ID:", productId);
    const cartItem={
      id: product._id, // Ensure valid ID
      product_name: product.name || "Unknown Product", // Default if undefined
      price: product.price
        ? product.price + (selectedVariant?.priceAdjustment || 0)
        : selectedVariant?.priceAdjustment || 0,
      image_link: product.images?.[0] || product.image_link || "https://via.placeholder.com/150",
      quantity,
      stock_quantity: selectedVariant?.stock || product.stock_quantity || 0,
      weight: product.weight || 0, // Default if undefined
      gst_rate: product.gst_rate || 0,
      hsn_code: product.hsn_code || "Unknown",
      variant: selectedVariant?.attributes || {},
    }
    console.log("cart item before add cart", cartItem)
    
    // dispatch(
    //   addToCart(cartItem)
    // );
  
    // // setQuantity(25);
    // ToastAndroid.show("Added to cart!", ToastAndroid.SHORT);

    try {
      // 🔴 Send cart data to backend (Replace with your API or Firebase code)
      // await axios.post("https://your-backend.com/cart", cartItem);
  
      // ✅ Dispatch Redux action
      dispatch(addToCart(cartItem));
  
      ToastAndroid.show("Added to cart!", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Failed to update cart:", error);
      Alert.alert("Error", "Failed to add product to cart.");
    }
  };

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.productImage} resizeMode="cover" />
  );

  const renderVariantItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.variantButton,
        selectedVariant?._id === item._id && styles.selectedVariantButton,
      ]}
      onPress={() => setSelectedVariant(item)}
    >
      <Text
        style={[
          styles.variantText,
          selectedVariant?._id === item._id && styles.selectedVariantText,
        ]}
      >
        {item?.attributes?.quality?.charAt(0).toUpperCase() + item?.attributes?.quality?.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B48FF" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  const stockStatus = getStockStatus(selectedVariant?.stock || product.stock_quantity);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Product Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <FlatList
            data={product.images || [product.image_link]}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.floor(event.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          />
          <View style={styles.imageDots}>
            {(product.images || [product.image_link]).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  selectedImageIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.product_name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          {product.variants && product.variants.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Select Variant</Text>
              <FlatList
                data={product.variants}
                renderItem={renderVariantItem}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.variantList}
              />
            </>
          )}

          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ₹{(product.price ? product.price + (selectedVariant?.priceAdjustment || 0) : selectedVariant?.priceAdjustment || 0).toFixed(2)}
            </Text>
            <Text style={[styles.stock, { color: stockStatus.color }]}>
              {stockStatus.text}
              {/* {selectedVariant?.stock || product.stock_quantity} */}
            </Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Details</Text>
            {selectedVariant ? (
              <>
                <Text style={styles.detailText}>Material: {selectedVariant.attributes.material}</Text>
                <Text style={styles.detailText}>Size: {selectedVariant.attributes.size}</Text>
                <Text style={styles.detailText}>Weight: {selectedVariant.attributes.weight}g</Text>
                <Text style={styles.detailText}>Pages: {selectedVariant.attributes.pages}</Text>
              </>
            ) : (
              <>
                <Text style={styles.detailText}>Weight: {product.weight} kg</Text>
                <Text style={styles.detailText}>Category: {product.category}</Text>
                <Text style={styles.detailText}>Seller Location: {product.seller_state}</Text>
              </>
            )}
          </View>

          {/* <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decreaseQuantity}
              disabled={quantity <= 25 || stockStatus.text === "Out of Stock"}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={increaseQuantity}
              disabled={
                (selectedVariant?.stock || product.stock_quantity) <=
                  (cartItems.find(
                    (item) =>
                      item.id === id &&
                      (item.variant?.quality || "default") === (selectedVariant?.attributes.quality || "default")
                  )?.quantity || 0) + quantity ||
                stockStatus.text === "Out of Stock"
              }
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View> */}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.addToCartButton, isInCart && styles.inCartButton]}
              onPress={handleAddToCart}
              disabled={stockStatus.text === "Out of Stock"}
            >
              <Ionicons name="cart-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>{isInCart ? "Added to Cart" : "Add to Cart"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.customizeButton}
              onPress={() => navigation.navigate("ProductCustomization", { id: product._id ,orderId: undefined})}
              disabled={stockStatus.text === "Out of Stock"}
            >
              <Ionicons name="color-palette-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Customize</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetail;