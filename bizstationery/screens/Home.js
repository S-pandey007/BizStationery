import React from 'react';
import { View, Text, TouchableOpacity, ScrollView,StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For profile icon
import styles from '../style/HomeStyle';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Floating Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hi Shubham</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={40} color="#6B48FF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        
      </ScrollView>
    </View>
  );
};

export default HomeScreen;