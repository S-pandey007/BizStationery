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
    alignItems: "center",
    justifyContent:'space-between',
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
  backButton: {
    marginRight: 15, // Space between back arrow and title
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center", // Centers the title horizontally
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20, // Space between header and content
  },
  contentContainer: {
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  menuItem: {
    width: width / 3 - 15, // 3 items per row with margins
    backgroundColor: "#FFFFFF",
    // backgroundColor: 'red',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
});

export default styles;