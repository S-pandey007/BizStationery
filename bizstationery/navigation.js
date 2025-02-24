import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './AuthProvider';
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Registration';
import HomeScreen from './screens/Home';
import WelcomeScreen from './screens/Welcome';

const Stack = createNativeStackNavigator();

// ✅ Protected Route Component
const ProtectedRoute = ({ navigation, children }) => {
  const { user, loading } = useContext(AuthContext);

  // Show a loader while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If user is not logged in, redirect to Welcome page
  useEffect(() => {
    if (!user) {
      navigation.replace('Welcome');
    }
  }, [user, navigation]);

  return user ? children : null;
};

export default  function Navigation() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {/* Public Routes */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

          {/* ✅ Protected Routes Wrapped in `ProtectedRoute` */}
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
          >
            {props => (
              <ProtectedRoute {...props}>
                <HomeScreen {...props} />
              </ProtectedRoute>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}


const Drawer = createDrawerNavigator();

