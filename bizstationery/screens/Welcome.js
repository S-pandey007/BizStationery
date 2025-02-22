import React from 'react';
import {
  View,
  ImageBackground,
  Pressable,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../style/welcomStyle' // Import styles from separate file
import { useNavigation } from '@react-navigation/native';
export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window'); // Define dimensions inside component
  const increasedHeight = height * 1.2;
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../assets/media/welcomeImage.png')}
        style={[styles.backgroundImage, { width, height: increasedHeight }]} // Use dimensions dynamically
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        >
          <View style={styles.content}>
            
            <Text style={styles.subtitle}>Where convenience meets efficiency</Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => navigation.navigate('Register')}
            >
              {({ pressed }) => (
                <LinearGradient
                  colors={['#6B48FF', '#8E2DE2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      pressed && styles.buttonTextPressed,
                    ]}
                  >
                    Register Now
                  </Text>
                </LinearGradient>
              )}
            </Pressable>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}