import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import styles from '../style/ProfileStyle'; // Import the styles


const ProfileScreen = () => {
  // Sample data (replace with real data from AuthContext or API)
  const userData = {
    name: 'Shubham',
    location: 'Pune, Maharashtra',
    mobile: '8770037161',
    email: 'shubhampandey3883@gmail.com',
    address: 'Address, Pune, Maharashtra, India, 411041',
    companyName: '-',
    gstin: '-',
    ifsc: '-',
    bankName: '-',
    stats: {
      messages: { total: 0, unread: 0 }, // Messages: Total and Unread
      productsOfInterest: { viewed: 0, favorited: 0 }, // Products of Interest: Viewed and Favorited
      sales: { total: 0, completed: 0 }, // Sales: Total and Completed
    },
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header (outside ScrollView) */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#666" /> {userData.location}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="phone-portrait-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Primary Mobile: {userData.mobile}</Text>
            <Text style={styles.verified}>✓</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Primary Email: {userData.email}</Text>
            <Text style={styles.verified}>✓</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="home-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Address: {userData.address}</Text>
          </View>
        </View>

        {/* Company Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Information</Text>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="business-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Company Name: {userData.companyName}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-text-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>GSTIN: {userData.gstin}</Text>
          </View>
          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-instagram" size={24} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Sections (Messages, Products of Interest, Sales) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Stats</Text>
          
          {/* Messages Section */}
          <Text style={styles.subSectionTitle}>Messages</Text>
          <View style={styles.statsContainer}>
            {[
              { label: 'Total Messages', value: userData.stats.messages.total },
              { label: 'Unread Messages', value: userData.stats.messages.unread },
            ].map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel} numberOfLines={1}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Products of Interest Section */}
          <Text style={styles.subSectionTitle}>Products of Interest</Text>
          <View style={styles.statsContainer}>
            {[
              { label: 'Viewed Products', value: userData.stats.productsOfInterest.viewed },
              { label: 'Favorited Products', value: userData.stats.productsOfInterest.favorited },
            ].map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel} numberOfLines={1}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Sales Section */}
          <Text style={styles.subSectionTitle}>Sales</Text>
          <View style={styles.statsContainer}>
            {[
              { label: 'Total Sales', value: userData.stats.sales.total },
              { label: 'Completed Sales', value: userData.stats.sales.completed },
            ].map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel} numberOfLines={1}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bank Account Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Account Details</Text>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="card-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>IFSC Code: {userData.ifsc}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="bank-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Bank Name: {userData.bankName}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;