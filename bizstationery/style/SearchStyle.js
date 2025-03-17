import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10,backgroundColor:'#fff' },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  message: { textAlign: "center", marginTop: 20, color: "#666" },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  button: { padding: 10, backgroundColor: "#6B48FF", borderRadius: 5 },
  buttonText: { color: "#fff" },
  disabledButton: { backgroundColor: "#ccc" },
  pageInfo: { fontSize: 14, color: "#666" },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B48FF", // Purple for price
    marginBottom: 5,
  },
  itemVariants: {
    fontSize: 14,
    color: "#666",
  },

  categorySection: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  categoryItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 14,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#6B48FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#6B48FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%', // Half width for side-by-side
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  // filter price input 
  priceInput: {
    width: '35%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 15,
  },
});

export default styles;
