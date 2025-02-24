import { StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light gray background
  },
  header: {
    position: 'absolute', // Makes it "float" over content
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    // paddingVertical: 15,
 // Adjust for status bar
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 10, // Ensure it stays above content
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    padding: 5,
  },
  contentContainer: {
    paddingTop: 100, // Space for floating header
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor:'white'
  },
  contentText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  placeholderContent: {
    width: width * 0.9,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
});

export default styles;