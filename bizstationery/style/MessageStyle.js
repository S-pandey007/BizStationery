import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FA",
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#6B48FF",
        padding: 16,
        paddingTop: 20,
      },
      headerContent: {
        flex: 1,
        marginLeft: 12,
      },
      headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#FFFFFF",
      },
      headerSubtitle: {
        fontSize: 14,
        color: "#E0E0E0",
        marginTop: 2,
      },
      latestMessages: {
        padding: 8,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
      },
      latestMessageContainer: {
        marginRight: 12,
        padding: 8,
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        maxWidth: 200,
      },
      latestMessageText: {
        fontSize: 14,
        color: "#1A1A1A",
        fontWeight: "500",
      },
      latestTimestamp: {
        fontSize: 12,
        color: "#A0A0A0",
        marginTop: 4,
      },
      chatContainer: {
        padding: 16,
        paddingBottom: 100,
      },
      messageContainer: {
        maxWidth: "80%",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
      },
      userMessage: {
        backgroundColor: "#FFFFFF",
        alignSelf: "flex-end",
      },
      wholesalerMessage: {
        backgroundColor: "#FFFFFF",
        alignSelf: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      messageText: {
        fontSize: 16,
        color: "#1A1A1A",
      },
      timestamp: {
        fontSize: 12,
        color: "#A0A0A0",
        marginTop: 4,
        textAlign: "right",
      },
      actionButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 12,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
      },
      actionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#6B48FF",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
      },
      actionButtonText: {
        fontSize: 14,
        color: "#FFFFFF",
        marginLeft: 8,
        fontWeight: "600",
      },
      inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
      },
      inputOptions: {
        flexDirection: "row",
        marginRight: 8,
      },
      optionButton: {
        padding: 8,
      },
      input: {
        flex: 1,
        backgroundColor: "#F0F0F0",
        borderRadius: 20,
        padding: 12,
        fontSize: 16,
        color: "#1A1A1A",
      },
      sendButton: {
        backgroundColor: "#6B48FF",
        borderRadius: 20,
        padding: 12,
        left:5
      },
  });
  
  export default styles