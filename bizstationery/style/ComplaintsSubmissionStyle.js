import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F6FA",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: "#FFFFFF",
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#1A1A1A",
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    contentText: {
      fontSize: 18,
      color: "#666",
      textAlign: "center",
      marginBottom: 20,
    },
    viewComplaintsButton: {
      backgroundColor: "#6B48FF",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    viewComplaintsText: {
      fontSize: 16,
      color: "#FFFFFF",
      fontWeight: "600",
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
      maxHeight: "80%",
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
    modalLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#1A1A1A",
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: "#1A1A1A",
      marginBottom: 16,
      minHeight: 100,
      textAlignVertical: "top",
    },
    imagePickerButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F0F0F0",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    imagePickerText: {
      fontSize: 14,
      color: "#007AFF",
      marginLeft: 8,
    },
    imageList: {
      marginBottom: 16,
    },
    imageContainer: {
      position: "relative",
      marginRight: 8,
    },
    imagePreview: {
      width: 80,
      height: 80,
      borderRadius: 8,
    },
    removeButton: {
      position: "absolute",
      top: -10,
      right: -10,
    },
    submitButton: {
      backgroundColor: "#6B48FF",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    submitButtonText: {
      fontSize: 16,
      color: "#FFFFFF",
      fontWeight: "600",
    },
  });

  export default styles;