import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFF',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  section: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFF',
    marginBottom: 15,
    textAlign: 'left',
  },
  input: {
    width: width * 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextBottonContainer: {
    alignSelf: 'center',
    backgroundColor: '#FFFFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 10,
  },
  nextBottonText: {
    color: '#6B48FF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden',
    width: width * 0.9,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFF',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  // Added for error messages
  errorText: {
    color: '#FF4444',
    fontSize: 15,
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },

  // Added for OTP verification
  sendOTPButton: {
    backgroundColor: '#423CF5',
    paddingTop: 5,
    width: 90,
    borderRadius: 10,
  },

  gstinButton:{
    backgroundColor: '#423CF5',
    paddingTop: 5,
    width: 123,
    borderRadius: 10,
  }
});

export default styles;