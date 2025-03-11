import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/HomeStyle';
import { useNavigation } from "@react-navigation/native";
import {fetchCategories} from '../api/apiService';
import {useSelector , useDispatch} from 'react-redux'

const HomeScreen = () => {
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  // const [cartCount, setCartCount] = useState();

    // fetch categories data
    const dispatch = useDispatch()
    const {categoryList} = useSelector((state)=> state.categories)
    const cartItems = useSelector((state)=> state.cart.items);
    // setCartCount(cartItems.length)
    const cartCounts = cartItems.length
    // console.log(cartCounts);
    // setCartCount(cartCounts)

    const CategoryData = categoryList.category
    useEffect(() => {
      dispatch(fetchCategories())
    },[dispatch])
  
    useEffect(()=>{
      // console.log('category list:',categoryList.category);
      // console.log(categoryList.category[0].image_link)
      // console.log(categoryList.category[0].category)
    },[categoryList])
  

  const IMAGE_URL =
    'https://th.bing.com/th/id/OIP.iyX8lP4wxAZzW7Fa3JWhawHaGD?w=1000&h=818&rs=1&pid=ImgDetMain';

  const categories = [
    { id: '1', name: 'Electronics', image: IMAGE_URL },
    { id: '2', name: 'Fashion', image: IMAGE_URL },
    { id: '3', name: 'Home', image: IMAGE_URL },
    { id: '4', name: 'Books', image: IMAGE_URL },
  ];

  const recommendedItems = [
    { id: '1', name: 'Smartphone', image: IMAGE_URL },
    { id: '2', name: 'Jacket', image: IMAGE_URL },
    { id: '3', name: 'Chair', image: IMAGE_URL },
    { id: '4', name: 'Novel', image: IMAGE_URL },
  ];

  const featuredProducts = [
    { id: '1', name: 'Wireless Earbuds', price: '$49.99', image: IMAGE_URL },
    { id: '2', name: 'Leather Bag', price: '$89.99', image: IMAGE_URL },
    { id: '3', name: 'Smart Watch', price: '$129.99', image: IMAGE_URL },
  ];

  const dealsOfTheDay = [
    { id: '1', name: 'Bluetooth Speaker', price: '$29.99', originalPrice: '$49.99', image: IMAGE_URL },
    { id: '2', name: 'Sneakers', price: '$39.99', originalPrice: '$69.99', image: IMAGE_URL },
    { id: '3', name: 'Table Lamp', price: '$19.99', originalPrice: '$34.99', image: IMAGE_URL },
  ];

  // Data structure for the single FlatList
  const sections = [
    { type: 'search', data: null },
    { type: 'promo', data: IMAGE_URL },
    { type: 'categories', data: categories },
    { type: 'recommended', data: recommendedItems },
    { type: 'featured', data: featuredProducts },
    { type: 'deals', data: dealsOfTheDay },
    { type: 'footer', data: IMAGE_URL },
  ];

  // Render functions
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
    onPress={() => navigation.navigate('CategoryDetail', { category: item.category })}
    style={styles.categoryItem}>
      <Image source={{ uri: item.image_link }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.category}</Text>
    </TouchableOpacity>
  );

  const renderRecommendedItem = ({ item }) => (
    <TouchableOpacity style={styles.recommendedItem}>
      <Image source={{ uri: item.image }} style={styles.recommendedImage} />
      <Text style={styles.recommendedName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedProduct = ({ item }) => (
    <TouchableOpacity style={styles.featuredProductItem}>
      <Image source={{ uri: item.image }} style={styles.featuredProductImage} />
      <View style={styles.featuredProductDetails}>
        <Text style={styles.featuredProductName}>{item.name}</Text>
        <Text style={styles.featuredProductPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDealItem = ({ item }) => (
    <TouchableOpacity style={styles.dealItem}>
      <Image source={{ uri: item.image }} style={styles.dealImage} />
      <Text style={styles.dealName}>{item.name}</Text>
      <View style={styles.dealPriceContainer}>
        <Text style={styles.dealPrice}>{item.price}</Text>
        <Text style={styles.dealOriginalPrice}>{item.originalPrice}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSection = ({ item }) => {
    switch (item.type) {
      case 'search':
        return (
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Pressable style={styles.searchPressable}>
              <Text style={styles.searchPressableText}>Search</Text>
            </Pressable>
          </View>
        );
      case 'promo':
        return <Image source={{ uri: item.data }} style={styles.promoImage} />;
      case 'categories':
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
              data={CategoryData}
              renderItem={renderCategoryItem}
              // keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryList}
            />
          </View>
        );
      case 'recommended':
        return (
          <View>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <FlatList
              data={item.data}
              renderItem={renderRecommendedItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recommendedList}
            />
          </View>
        );
      case 'featured':
        return (
          <View>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <FlatList
              data={item.data}
              renderItem={renderFeaturedProduct}
              keyExtractor={(item) => item.id}
              scrollEnabled={false} // Disable nested scrolling
              style={styles.featuredList}
            />
          </View>
        );
      case 'deals':
        return (
          <View>
            <Text style={styles.sectionTitle}>Deals of the Day</Text>
            <FlatList
              data={item.data}
              renderItem={renderDealItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.dealList}
            />
          </View>
        );
      case 'footer':
        return <Image source={{ uri: item.data }} style={styles.footerBanner} />;
      default:
        return null;
    }
  };

  const handleSearchPress = () => {
    console.log('Search button pressed');
  };





  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Hi Shubham</Text>
        <View style={styles.headerIcons}>
          {/* <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchPress}
          >
            <Ionicons name="search-outline" size={30} color="#6B48FF" />
          </TouchableOpacity> */}
          <TouchableOpacity
          onPress={()=>navigation.navigate("Cart")}
          style={styles.cartButton}>
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
      />
    </View>
  );
};

export default HomeScreen;