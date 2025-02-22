import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Define width here for static calculations

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    width: width * 0.7, // Use static width calculation
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonTextPressed: {
    opacity: 0.95,
  },
});

export default styles;