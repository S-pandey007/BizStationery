import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    darkContainer: { backgroundColor: "#1A1A1A" },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: "#FFF",
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    headerTitle: { fontSize: 24, fontWeight: "700", color: "#1A1A1A", marginLeft: 16 },
    darkText: { color: "#FFF" },
    content: { padding: 16 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    settingLabel: { fontSize: 16, color: "#1A1A1A" },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: "#6B48FF",
      borderRadius: 8,
      marginTop: 12,
      alignItems: "center",
    },
    buttonText: { fontSize: 16, color: "#FFF", fontWeight: "600" },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "#FFF",
      borderRadius: 8,
      width: "90%",
      maxHeight: "50%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    modalTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A" },
    modalBody: { padding: 12 },
    languageOption: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    languageText: { fontSize: 16, color: "#1A1A1A" },
  });

  export default styles