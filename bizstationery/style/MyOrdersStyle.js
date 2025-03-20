import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  orderList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  orderDate: {
    fontSize: 14,
    color: "#A0A0A0",
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#A0A0A0",
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "90%",
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  modalBody: {
    padding: 16,
  },
  modalDetail: {
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 8,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 12,
    marginBottom: 8,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalItemText: {
    fontSize: 14,
    color: "#1A1A1A",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6B48FF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    justifyContent: "center",
  },
  downloadButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: "600",
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6B48FF",
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: "#6B48FF",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#6B48FF",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  filterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 30,
  },
  applyButton: {
    backgroundColor: "#6B48FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6B48FF",
  },
  resetButtonText: {
    fontSize: 16,
    color: "#6B48FF",
    fontWeight: "600",
  },

  // order cancel button styles
cancelButton: {
  backgroundColor: "#FF4444",
  padding: 8,
  borderRadius: 8,
  marginTop: 7,
},
cancelButtonText: {
  color: "#FFFFFF",
  textAlign: "center",
  fontSize:14,
  fontWeight:600
},
// Add to the existing StyleSheet.create({...})
modalSectionTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  marginTop: 15,
  marginBottom: 10,
},
tableContainer: {
  borderWidth: 1,
  borderColor: '#DDD',
  borderRadius: 5,
  overflow: 'hidden',
},
tableHeader: {
  flexDirection: 'row',
  backgroundColor: '#F5F5F5',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#DDD',
},
tableHeaderText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
},
tableRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#EEE',
},
tableCell: {
  fontSize: 14,
  color: '#666',
  textAlign: 'center',
},
customizeButton: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#6B48FF',
  paddingVertical: 5,
  borderRadius: 5,
  marginHorizontal: 5,
},
customizeButtonText: {
  color: '#FFF',
  fontSize: 12,
  marginLeft: 5,
},


});
      

  export default styles