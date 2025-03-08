import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For back arrow
import styles from '../style/MenuStyle'; // Import styles from the separate file
import { AuthContext } from "../AuthProvider";

const MenuScreen = ({ navigation }) => {
  const { user, logout, loading } = useContext(AuthContext);
  // Menu items data
  const menuItems = [
    { title: 'Home', icon: 'home-outline' },
    { title: 'Profile', icon: 'person-outline' },
    { title: 'All Categories', icon: 'grid-outline' },
    { title: 'Messages', icon: 'chatbox-outline' },
    { title: 'My Orders', icon: 'basket-outline' },
    { title: 'Saved Products', icon: 'bookmark-outline' },
    { title: 'Refund', icon: 'return-down-back-outline' },
    { title: 'Complaints', icon: 'warning-outline' },
    { title: 'Product Request & Customization', icon: 'create-outline' },
    { title: 'Product List & Status', icon: 'list-outline' },
    { title: 'Help & Support', icon: 'help-circle-outline' },
    { title: 'About BizStationery', icon: 'information-circle-outline' },
    { title: 'Settings', icon: 'settings-outline' },
    { title: 'Logout', icon: 'log-out-outline' },
  ];

  // Handle menu item press (example navigation, customizable)
  const handlePress = (item) => {
    if (item.title === 'Logout') {
      // Show confirmation alert before logging out
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            onPress: () => handleLogout(),
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
    } else {
      console.log(`${item.title} pressed`);
    }
  };

  const handleLogout = async () => {
    await logout(); // Call the logout function from AuthContext
    navigation.replace("Welcome"); // Navigate to WelcomeScreen after logout
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Menu</Text>
      </View>

      {/* Scrollable Grid of Menu Items */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handlePress(item)}
            >
              <Ionicons name={item.icon} size={24} color="#6B48FF" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default MenuScreen;