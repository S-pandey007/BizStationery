import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // White background for the whole screen
  },
  // Fixed Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: "absolute", // Fixed at the top
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Stays above scrolling content
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cartButton: {
    marginRight: 15,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF4D4D",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  profileButton: {
    padding: 5,
  },
  // Scrollable Content
  contentContainer: {
    paddingTop: 70, // Space for the fixed header
    paddingBottom: 50,
    backgroundColor: "#fff", // Consistent white background
  },
  // Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  // Promotional Image
  promoImage: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 15,
  },
  // Section Header (Bold Text + Category Button)
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    
  },
  categoryButton: {
    backgroundColor: "#6B48FF",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  categoryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  // Categories FlatList
  categoryList: {
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Circular image
  },
  categoryName: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  // Recommended Items FlatList
  recommendedList: {
    marginBottom: 20,
  },
  recommendedItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  recommendedImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  recommendedName: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  // Featured Products
  featuredList: {
    marginBottom: 20,
  },
  featuredProductItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  featuredProductImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  featuredProductDetails: {
    marginLeft: 10,
    justifyContent: "center",
  },
  featuredProductName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  featuredProductPrice: {
    fontSize: 14,
    color: "#6B48FF",
    marginTop: 5,
  },
  // Deals of the Day
  dealList: {
    marginBottom: 20,
  },
  dealItem: {
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#FFF5F5", // Light red background for deal vibe
    borderRadius: 10,
    padding: 10,
  },
  dealImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  dealName: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  dealPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  dealPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF4D4D",
    marginRight: 5,
  },
  dealOriginalPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },
  // Footer Banner
  footerBanner: {
    width: "90%",
    height: 100,
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 20,
  },

  // Search Container and its children
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5, // Added for better vertical spacing
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1, // Takes up remaining space between icon and button
    height: 40,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0, // Prevents extra padding inside TextInput
  },
  searchPressable: {
    backgroundColor: "#6B48FF", // Matches your app’s purple theme
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10, // Space between input and button
  },
  searchPressableText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  // Removed unused styles
  // contentText, placeholderContent, placeholderText were not used in the latest HomeScreen
});

export default styles;