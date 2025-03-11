import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { removeFromSaveItems } from "../redux/slice/savedItemsSlice";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Separate component for each saved item
const SavedItem = ({ item, onRemove }) => {
  const navigation = useNavigation();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => navigation.navigate("ProductDetail", { product: item.id })}
      >
        <Image
          source={{ uri: item.image_link }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.product_name}
          </Text>
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF6347" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const SavedScreen = () => {
  const dispatch = useDispatch();
  const savedItems = useSelector((state) => state.savedItems.items) || [];
  const navigation = useNavigation()
  useEffect(() => {
    console.log("Saved Items:", JSON.stringify(savedItems, null, 2));
  }, [savedItems]);

  const handleRemoveItem = (id) => {
    dispatch(removeFromSaveItems(id));
  };

  if (savedItems.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No items saved yet.</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.shopButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Items</Text>
        <Text style={styles.headerSubtitle}>
          {savedItems.length} item{savedItems.length !== 1 ? "s" : ""}
        </Text>
      </View>
      <FlatList
        data={savedItems}
        renderItem={({ item }) => <SavedItem item={item} onRemove={handleRemoveItem} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
  },
  header: {
    flexDirection:'row',
    justifyContent:'space-between',
    padding: 16,
    alignItems:'center',
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B48FF",
  },
  removeButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  shopButton: {
    backgroundColor: "#6B48FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default SavedScreen;