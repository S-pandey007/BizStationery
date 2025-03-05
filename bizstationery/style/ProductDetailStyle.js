
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light gray background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 70, // Space for the fixed header
  },
  contentContainer: {
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  imageSlider: {
    height: height * 0.4, // 40% of screen height for images
  },
  productImage: {
    width: width,
    height: height * 0.4,
    resizeMode: 'cover',
  },
  productInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  productBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  discountText: {
    fontSize: 14,
    color: '#4CAF50', // Green for discount
    fontWeight: '500',
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    lineHeight: 22,
  },
  productDetails: {
    marginBottom: 15,
  },
  bulkMessage: {
    fontSize: 16,
    color: '#FF4D4D', // Red for warning
    marginBottom: 15,
    fontWeight: '500',
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  quantityButton: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addToCartButton: {
    backgroundColor: '#6B48FF', // Purple for action
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  inCartButton: {
    backgroundColor: '#4CAF50', // Green when added to cart
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  customizeButton: {
    backgroundColor: '#FF9800', // Orange for customization
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  customizeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stockStatus: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 5,
  },
});

export default styles;