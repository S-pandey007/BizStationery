import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
  TextInput,
  Pressable,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../style/HomeStyle";
import { useNavigation } from "@react-navigation/native";
import { fetchCategories } from "../api/apiService";
import { useSelector, useDispatch } from "react-redux";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = Constants.expoConfig.extra.API_URL;
console.log(BASE_URL);

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const categoryData = useSelector((state) => state.categories);
  const categoryList = categoryData.categoryList;
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const cartCounts = cartItems.length;

  const [recommendedData, setRecommendedData] = useState([]);
  const [featuredData, setFeaturedData] = useState([]);
  const [productCart, setProductCart] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const [userName, setUserName] = useState();
  

  useEffect(()=>{
    const fetchLocalUser = async () => {
      const userData = await AsyncStorage.getItem('loggedInUser');
      const parsedData = JSON.parse(userData);
      console.log("Home screen fecth userData",parsedData.data.name);
    
      setUserName(parsedData.data.name.split(' ')[0]);
    };
    fetchLocalUser();
  },[])
  // Fetch all data (initial and refresh)
  const fetchAllData = async () => {
    try {
      // Fetch random products
      const randomResponse = await fetch(`${BASE_URL}product/random`);
      const randomData = await randomResponse.json();
      // console.log("random data", randomData.products[0]?.variants);
      setRecommendedData(randomData.products || []);

      // Fetch featured products
      const featuredResponse = await fetch(`${BASE_URL}product/featured`);
      const featuredDataResponse = await featuredResponse.json();
      // console.log("featured data", featuredDataResponse.products);
      setFeaturedData(featuredDataResponse.products || []);

      // Fetch produc p
      // cart
      const cartResponse = await fetch(`${BASE_URL}product/productCart`);
      const cartData = await cartResponse.json();
      // console.log("product cart data", cartData.products[0]);
      setProductCart(cartData.products[0] || null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRecommendedData([]);
      setFeaturedData([]);
      setProductCart(null);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    dispatch(fetchCategories());
    fetchAllData();
  }, [dispatch]);

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData(); // Re-fetch all data
    setRefreshing(false);
  };

  const IMAGE_URL =
    "https://th.bing.com/th/id/OIP.iyX8lP4wxAZzW7Fa3JWhawHaGD?w=1000&h=818&rs=1&pid=ImgDetMain";

  const sections = [
    { type: "search", data: null },
    { type: "promo", data: IMAGE_URL },
    { type: "categories", data: categoryList },
    { type: "recommended", data: recommendedData },
    { type: "featured", data: featuredData },
    { type: "deals", data: recommendedData },
    { type: "productCart", data: productCart },
    { type: "footer", data: IMAGE_URL },
  ];


  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("CategoryDetail", { category: item._id })
      }
      style={styles.categoryItem}
    >
      <Image source={{ uri: item.images }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRecommendedItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProductDetail", { product: item._id })
      }
      style={styles.recommendedItem}
    >
      <Image source={{ uri: item.images[0] }} style={styles.recommendedImage} />
      <Text style={styles.recommendedName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedProduct = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProductDetail", { product: item._id })
      }
      style={styles.featuredProductItem}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={styles.featuredProductImage}
      />
      <View style={styles.featuredProductDetails}>
        <Text style={styles.featuredProductName}>{item.name}</Text>
        <Text style={styles.featuredProductPrice}>
          {item.variants[0].attributes.material}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderDealItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProductDetail", { product: item._id })
      }
      style={styles.dealItem}
    >
      <Image source={{ uri: item.images[0] }} style={styles.dealImage} />
      <Text style={styles.dealName}>{item.name}</Text>
      <View style={styles.dealPriceContainer}>
        <Text style={styles.dealPrice}>
          ₹{item.variants[0].priceAdjustment}
        </Text>
        {/* hot dals sale offer custimized */}
        <Text style={styles.dealOriginalPrice}>
          ₹{item.variants[0].priceAdjustment + 20}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSection = ({ item }) => {
    switch (item.type) {
      case "search":
        return (
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Pressable
              onPress={() => {
                if (searchQuery.trim() === "") {
                  ToastAndroid.show(
                    "Please enter a search query",
                    ToastAndroid.SHORT
                  );
                  return;
                }
                navigation.navigate("Search", { query: searchQuery });
              }}
              style={styles.searchPressable}
            >
              <Text style={styles.searchPressableText}>Search</Text>
            </Pressable>
          </View>
        );
      case "promo":
        return <Image source={{ uri: item.data }} style={styles.promoImage} />;
      case "categories":
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore Our Collections</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Category")}
                style={styles.categoryButton}
              >
                <Text style={styles.categoryButtonText}>Categories</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={item.data}
              renderItem={renderCategoryItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryList}
            />
          </View>
        );
      case "recommended":
        return (
          <View>
            <Text style={[styles.sectionTitle, { padding: 12 }]}>
              Recommended For You
            </Text>
            <FlatList
              data={item.data}
              renderItem={renderRecommendedItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recommendedList}
            />
          </View>
        );
      case "featured":
        return (
          <View>
            <Text style={[styles.sectionTitle, { padding: 12 }]}>
              Featured Products
            </Text>
            <FlatList
              data={item.data}
              renderItem={renderFeaturedProduct}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              style={styles.featuredList}
            />
          </View>
        );
      case "productCart":
        return item.data ? (
          <Pressable
            onPress={() =>
              navigation.navigate("ProductDetail", { product: item.data._id })
            }
            style={styles.cardContainer}
          >
            <Text style={[styles.sectionTitle, { padding: 12 }]}>
              Product Spotlight
            </Text>
            <Image
              source={{ uri: item.data.images[0] }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <View style={styles.detailsContainer}>
              <Text style={styles.productName}>{item.data.name}</Text>
              <Text style={styles.productPrice}>
                Price: ₹{item.data.variants[0].priceAdjustment}
              </Text>
              <View style={styles.attributesContainer}>
                <Text style={styles.attributesTitle}>Attributes:</Text>
                <Text style={styles.attributeText}>
                  Size: {item.data.variants[0].attributes.size}
                </Text>
                <Text style={styles.attributeText}>
                  Material: {item.data.variants[0].attributes.material}
                </Text>
                <Text style={styles.attributeText}>
                  Quality: {item.data.variants[0].attributes.quality}
                </Text>
              </View>
            </View>
          </Pressable>
        ) : (
          <Text style={{ padding: 12, textAlign: "center" }}>
            Loading Product...
          </Text>
        );
      case "deals":
        return (
          <View>
            <Text style={[styles.sectionTitle, { padding: 12 }]}>
              Hot Deals of the Day
            </Text>
            <FlatList
              data={item.data}
              renderItem={renderDealItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.dealList}
            />
          </View>
        );
      case "footer":
        return (
          <Image source={{ uri: item.data }} style={styles.footerBanner} />
        );
      default:
        return null;
    }
  };

  // Fetch user data from AsyncStorage
  useEffect(()=>{
      const storeAllData_in_localStorage =async()=>{
        try {
          // Retrieve user data from AsyncStorage
          const storedData = await AsyncStorage.getItem("loggedInUser");
          if (!storedData) throw new Error("No user data in storage");
        
          // Parse the stored JSON data
          const parsedData = JSON.parse(storedData);
          console.log("User data from storage:", parsedData.data);
          console.log("User data from storage:", parsedData.data.name);
          console.log("User data from storage:", parsedData.data.email);
          console.log("User data from storage:", parsedData.data.mobile);
        
          // Fetch user profile from backend
          const response = await fetch(
            `${BASE_URL}retailer/profile/${parsedData.data.name}/${parsedData.data.mobile}/${parsedData.data.email}`
          );
          if (!response.ok) throw new Error("Failed to fetch retailer profile");
        
          // Parse the response data
          const data = await response.json();
          console.log("Retailer profile:", data.data);
        
          const userId = data.data._id || ""; // Get the user ID from API response
        
          // Update AsyncStorage with the userId
          const updatedUserData = { ...parsedData.data, id: userId };
          await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
        
          console.log("Updated user data stored in AsyncStorage:", updatedUserData);
        } catch (error) {
          // console.error("Error fetching user details:", error.message);
          alert("Please Update your Profile.");
        }
        
      }
  
      storeAllData_in_localStorage()
  
    },[])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Hi {userName}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Cart")}
            style={styles.cartButton}
          >
            <Ionicons name="cart-outline" size={30} color="#6B48FF" />
            {cartCounts > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCounts}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.profileButton}
          >
            <Ionicons name="person-circle-outline" size={40} color="#6B48FF" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.type}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6B48FF"]} // Spinner color
            tintColor="#6B48FF" // iOS spinner color
          />
        }
      />
    </View>
  );
};

export default HomeScreen;
