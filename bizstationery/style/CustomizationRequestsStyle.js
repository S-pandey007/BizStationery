import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  requestList: {
    padding: 16,
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  requestId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  requestDate: {
    fontSize: 14,
    color: "#A0A0A0",
  },
  requestProduct: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  requestDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom:10
  },
  requestStatus: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
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
    marginBottom: 18,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 12,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  imageListContainer: {
    marginBottom: 12,
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  modalStatus: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  filterSection: {
    marginBottom: 16,
    padding: 16,
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
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  requestDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  paymentStatus: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
  payButton: {
    backgroundColor: '#6B48FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom:30
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelPaymentButton: {
    backgroundColor: '#EF5350',
    padding: 10,
    alignItems: 'center',
  },
  cancelPaymentText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;