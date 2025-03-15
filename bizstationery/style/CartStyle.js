import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F5F5F5", // Light gray background
    backgroundColor: "#fff", // Light gray background
    paddingTop: 70, // Space for the fixed header
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 18,
    color: "#666",
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 40, // Space from bottom of the screen
  },
  contentContainer: {
    paddingBottom: 20,
  },
  productItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  originalPrice: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "line-through",
    marginLeft: 10,
  },
  productMeta: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  productStatus: {
    fontSize: 14,
    color: "#4CAF50", // Green for "In stock"
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: "#F5F5F5",
    padding: 5,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 10,
  },
  removeButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  removeButtonText: {
    fontSize: 16,
    color: "#FF4D4D", // Red for delete
    textAlign:'center',
    padding:2,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#6B48FF",
    paddingVertical: 5,
    // paddingHorizontal:5,
    borderRadius: 8,
    // marginLeft: 10,
    marginVertical: 5,
  },
  saveButtonText: {
    fontSize: 14,
    padding: 4,
    textAlign: "center",
    color: "#fff",

    fontWeight: "bold",
  },
  summaryContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#333",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B48FF", // Purple for emphasis
  },
  proceedButton: {
    backgroundColor: "#6B48FF", // Yellow button as per screenshot
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  savedSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  savedCategory: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  savedCategoryText: {
    fontSize: 14,
    color: "#333",
  },

  // cart product details section
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "95%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  tableContainer: {
    flexGrow: 0,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  tableCell: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  oddRow: {
    backgroundColor: "#fff",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B48FF",
  },
  closeButton: {
    backgroundColor: "#6B48FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  InfoContainer: {
    paddingVertical: 10,
  },
  infoText: {
    color: "red",
    fontSize: 15,
  },
  sectionTitle:{
    fontSize: 18,
    fontWeight:'bold',
    padding:10,
  }
});

export default styles;