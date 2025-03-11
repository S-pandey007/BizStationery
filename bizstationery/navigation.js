import React, { useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext, AuthProvider } from "./AuthProvider";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Registration";
import HomeScreen from "./screens/Home";
import WelcomeScreen from "./screens/Welcome";
import CategoryScreen from "./screens/Category";
import ProductCustomizationRequest from "./screens/ProductCustomizationRequest";
import CategoryDetailSccreen from "./screens/CategoryDetail";
import ProductDetailScreen from "./screens/ProductDetail";
import ProceedOrderScreen from './screens/ProceedOrder';
import SavedScreen from './screens/SavedScreen'

import MenuScreen from "./screens/Menu"; // Create this file
import ProfileScreen from "./screens/Profile"; // Create this file
import CartScreen from "./screens/Cart";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// ✅ Protected Route Component



// bottom tab navigator

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return focused ? (
              <Entypo name="home" size={26} color="#6B48FF" />
            ) : (
              <Entypo name="home" size={26} color="#B4A8E8" />
            );
          } else if (route.name === "Menu") {
            return focused ? (
              <Entypo name="menu" size={24} color="#6B48FF" />
            ) : (
              <Entypo name="menu" size={24} color="#B4A8E8" />
            );
          } else if (route.name === "Cart") {
            return focused ? (
              <Feather name="shopping-cart" size={24} color="#6B48FF" />
            ) : (
              <Feather name="shopping-cart" size={24} color="#B4A8E8" />
            );
          } else if (route.name === "Profile") {
            return focused ? (
              <MaterialCommunityIcons
                name="account"
                size={28}
                color="#6B48FF"
              />
            ) : (
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color="#B4A8E8"
              />
            );
          }
        },
        tabBarActiveTintColor: "#6B48FF",
        tabBarInactiveTintColor: "#B4A8E8",
        tabBarLabelStyle: {
          fontSize: 13, // Increase text size
          fontWeight: "bold", // Make text bold
          paddingBottom: 10,
        },
        tabBarStyle: {
          // backgroundColor: 'rgba(255, 255, 255, 0.99)', // Transparent white background for a floating effect
          paddingVertical: 19, // Slightly reduced padding for a clean look
          borderRadius: 20, // Rounded corners for a premium feel
          marginHorizontal: 14, // Margin for positioning
          marginBottom: 13, // Space from the bottom edge for a floating effect
          elevation: 10, // Adds shadow for a floating effect
          shadowColor: "#000", // Shadow color
          shadowOffset: { width: 0, height: -4 }, // Slight offset for floating effect
          shadowOpacity: 0.2, // Subtle shadow
          shadowRadius: 10, // Soft shadow for a smooth appearance
          position: "absolute", // Places the tab bar at the bottom
          bottom: 0,
          left: 0,
          right: 0,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{ headerShown: false }}
      />
      
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const ProtectedRoute = ({ navigation, children }) => {
  const { user, loading } = useContext(AuthContext)||{};

  // Show a loader while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If user is not logged in, redirect to Welcome page
  // useEffect(() => {
  //   if (!user) {
  //     console.log("No user, redirecting to Welcome");
  //     navigation.replace("Welcome");
  //   }else {
  //     console.log("User found, staying on Home");
  //   }
  // }, [user, navigation]);

  return user ? children : null;
};

export default function Navigation() {
  const context = useContext(AuthContext);
  const { user, loading : authLoading } = context || {};
  console.log("App authLoading state:", authLoading, "user:", user);
  
  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <AuthProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Welcome"}>
          {/* Public Routes */}
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />

          {/* ✅ Protected Routes Wrapped in `ProtectedRoute` */}
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => (
              <ProtectedRoute {...props}>
                {/* <HomeScreen {...props} /> */}
                <TabNavigator />
              </ProtectedRoute>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Category"
            component={CategoryScreen}
            options={{ headerShown: false }}/>

          <Stack.Screen
          name="ProductCustomization"
          component={ProductCustomizationRequest}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="CategoryDetail"
          component={CategoryDetailSccreen}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="ProceedOrder"
          component={ProceedOrderScreen}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="Saved"
          component={SavedScreen}
          options={{ headerShown: false }}
          />


        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

