import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#6B48FF", // Solid purple
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  card: {
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  addressBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  placeholderText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  editButton: {
    backgroundColor: "#6B48FF",
    padding: 8,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#6B48FF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  previewButton: {
    backgroundColor: "#32CD32", // Green for simplicity
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  previewText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    padding: 10,
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  tableCell: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B48FF",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  closeButton: {
    backgroundColor: "#FF6347",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  downloadButton: {
    backgroundColor: "#6B48FF",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  paymentButton: {
    margin: 15,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#6B48FF",
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  webViewCloseButton: {
    backgroundColor: "#FF6347",
    padding: 15,
    alignItems: "center",
  },
});

  export default styles;