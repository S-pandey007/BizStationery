import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 70,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionSubTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 8,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  addressText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    fontSize: 16,
    color: "#888",
  },
  editIcon: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "97%",
    maxHeight: "85%",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%", // Half width for two inputs in a row
  },
  saveButton: {
    backgroundColor: "#34C759",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewInvoiceButton: {
    backgroundColor: "#6B48FF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  viewInvoiceText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  invoiceSection: {
    marginBottom: 20,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B48FF",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: "#FF3B30",
  },
  downloadButton: {
    backgroundColor: "#34C759",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  paymentText: {
    fontSize: 16,
    marginLeft: 10,
  },
  proceedButton: {
    backgroundColor: "#6B48FF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 10,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

  export default styles;