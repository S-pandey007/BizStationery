import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#FFF',
    padding:20,
    // marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
    alignSelf:'center'
  },
  headerTitleContainer:{
    backgroundColor:'#6B48FF',
    borderBottomStartRadius:20,
    borderBottomEndRadius:20
  },
  section: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#6B48FF',
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    borderLeftWidth:3,
    borderRightWidth:3,
    borderLeftColor:'#6B48FF',
    borderRightColor:'#6B48FF'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B48FF',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#111',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  nextBottonContainer: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nextBottonText: {
    color: '#6B48FF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 30,
    borderRadius: 10,
    overflow: 'hidden',
    width: width * 0.6,
    alignSelf: 'center',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sendOTPButton: {
    backgroundColor: '#423CF5',
    paddingVertical: 8,
    width: 90,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gstinButton: {
    backgroundColor: '#423CF5',
    paddingVertical: 8,
    width: 123,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
