import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { MaterialCommunityIcons } from '@expo/vector-icons'; // For bank-outline
import * as ImagePicker from 'expo-image-picker'; // For picking profile image
import { Picker } from '@react-native-picker/picker'; // For account type picker
import styles from '../style/ProfileStyle'; // Import the styles

const ProfileScreen = () => {
  // Sample data (replace with real data from AuthContext or API)
  const [userData, setUserData] = useState({
    name: 'Shubham',
    location: 'Pune, Maharashtra',
    mobile: '8770037161',
    email: 'shubhampandey3883@gmail.com',
    address: 'Address, Pune, Maharashtra, India, 411041',
    profileImage: 'https://via.placeholder.com/80', // Default profile image
    companyName: 'My E-Commerce Co.',
    companyWebsite: 'www.mycompany.com',
    gstin: '29ABCDE1234F5Z6',
    pan: 'ABCDE1234F',
    ifsc: 'SBIN0001234',
    accountNumber: '123456789012',
    bankName: 'State Bank of India',
    accountType: 'Savings',
    bankBranchAddress: '',
    socialLinks: {
      facebook: 'https://facebook.com/mycompany',
      instagram: 'https://instagram.com/mycompany',
      googleBusiness: 'https://g.co/mycompany',
      youtube: 'https://youtube.com/@mycompany',
    },
    stats: {
      messages: { total: 5, unread: 2 },
      productsOfInterest: { viewed: 10, favorited: 3 },
      sales: { total: 8, completed: 6 },
    },
  });

  // State for modals (all initialized as false to prevent automatic opening)
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isCompanyModalVisible, setIsCompanyModalVisible] = useState(false);
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);

  // State for form inputs in modals
  const [profileForm, setProfileForm] = useState({
    name: userData.name,
    location: userData.location,
    mobile: userData.mobile,
    email: userData.email,
    address: userData.address,
    profileImage: userData.profileImage,
  });
  const [companyForm, setCompanyForm] = useState({
    companyName: userData.companyName,
    companyWebsite: userData.companyWebsite,
    gstin: userData.gstin,
    pan: userData.pan,
    facebook: userData.socialLinks.facebook,
    instagram: userData.socialLinks.instagram,
    googleBusiness: userData.socialLinks.googleBusiness,
    youtube: userData.socialLinks.youtube,
  });
  const [bankForm, setBankForm] = useState({
    ifsc: userData.ifsc,
    accountNumber: userData.accountNumber,
    bankName: userData.bankName,
    accountType: userData.accountType,
    bankBranchAddress: userData.bankBranchAddress,
  });

  // Handle profile image pick (simple and tested)
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Needed', 'Please allow access to photos to select an image.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        setProfileForm({ ...profileForm, profileImage: pickerResult.assets[0].uri });
        console.log('Image picked successfully:', pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Handle form updates with simple validation (tested for smooth updates)
  const handleProfileUpdate = () => {
    if (!profileForm.name || !profileForm.mobile || !profileForm.email || !profileForm.address) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    setUserData({ ...userData, ...profileForm });
    setIsProfileModalVisible(false);
    console.log('Profile updated successfully:', profileForm);
  };

  const handleCompanyUpdate = () => {
    if (!companyForm.companyName || !companyForm.companyWebsite || !companyForm.gstin || !companyForm.pan) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    setUserData({
      ...userData,
      companyName: companyForm.companyName,
      companyWebsite: companyForm.companyWebsite,
      gstin: companyForm.gstin,
      pan: companyForm.pan,
      socialLinks: {
        facebook: companyForm.facebook,
        instagram: companyForm.instagram,
        googleBusiness: companyForm.googleBusiness,
        youtube: companyForm.youtube,
      },
    });
    setIsCompanyModalVisible(false);
    console.log('Company updated successfully:', companyForm);
  };

  const handleBankUpdate = () => {
    if (!bankForm.ifsc || !bankForm.accountNumber || !bankForm.bankName || !bankForm.accountType) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    setUserData({
      ...userData,
      ifsc: bankForm.ifsc,
      accountNumber: bankForm.accountNumber,
      bankName: bankForm.bankName,
      accountType: bankForm.accountType,
      bankBranchAddress: bankForm.bankBranchAddress,
    });
    setIsBankModalVisible(false);
    console.log('Bank updated successfully:', bankForm);
  };

  
  return (
    <View style={styles.container}>
      {/* Fixed Header (outside ScrollView) */}
      <View style={styles.header}>
        <Image
          source={{ uri: profileForm.profileImage || 'https://via.placeholder.com/80' }}
          style={styles.profileImage}
          onError={(e) => console.log('Image load error:', e)}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#666" /> {userData.location}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsProfileModalVisible(true)}>
          <Ionicons name="pencil-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Profile Modal (opens only on button click, closes properly) */}
      
      <Modal 
      animationType='slide'
      // transparent={true}
      visible={isProfileModalVisible}
      style={styles.modal}
      onRequestClose={() => {
        setIsProfileModalVisible(false);
      }}
      >
        <ScrollView style={styles.modalScroll}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerText}>
                {profileForm.profileImage.startsWith('https://') ? 'Change Profile Image' : 'Select Profile Image'}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.modalInput}
              value={profileForm.name}
              onChangeText={(text) => setProfileForm({ ...profileForm, name: text })}
              placeholder="Name"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={profileForm.location}
              onChangeText={(text) => setProfileForm({ ...profileForm, location: text })}
              placeholder="Location"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={profileForm.mobile}
              onChangeText={(text) => setProfileForm({ ...profileForm, mobile: text })}
              placeholder="Mobile Number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.modalInput}
              value={profileForm.email}
              onChangeText={(text) => setProfileForm({ ...profileForm, email: text })}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.modalInput}
              value={profileForm.address}
              onChangeText={(text) => setProfileForm({ ...profileForm, address: text })}
              placeholder="Address"
              placeholderTextColor="#888"
              multiline
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleProfileUpdate}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsProfileModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </Modal>

      {/* Scrollable Content (tested for smooth scrolling) */}
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Company Information</Text>
            <TouchableOpacity style={styles.editSectionButton} onPress={() => setIsCompanyModalVisible(true)}>
              <Text style={styles.editSectionText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="business-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Company Name: {userData.companyName}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="globe-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Company Website: {userData.companyWebsite}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-text-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>GSTIN: {userData.gstin}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="card-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>PAN: {userData.pan}</Text>
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
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-youtube" size={24} color="#FF0000" />
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
                <Text style={styles.statLabel}>{stat.label}</Text>
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
                <Text style={styles.statLabel}>{stat.label}</Text>
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
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bank Account Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bank Account Details</Text>
            <TouchableOpacity style={styles.editSectionButton} onPress={() => setIsBankModalVisible(true)}>
              <Text style={styles.editSectionText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="card-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>IFSC Code: {userData.ifsc}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="keypad-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Account Number: {userData.accountNumber}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="bank-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Bank Name: {userData.bankName}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="wallet-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Account Type: {userData.accountType}</Text>
          </View>
          {userData.bankBranchAddress && (
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="location-outline" size={20} color="#666" />
              </View>
              <Text style={styles.infoText}>Bank Branch Address: {userData.bankBranchAddress}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Company Modal (opens only on button click, closes properly) */}
  
       <Modal 
      animationType='slide'
      // transparent={true}
      visible={isCompanyModalVisible}
      style={styles.modal}
      onRequestClose={() => {
        setIsCompanyModalVisible(false);
      }}
      >
        <ScrollView style={styles.modalScroll}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Company Information</Text>
            <TextInput
              style={styles.modalInput}
              value={companyForm.companyName}
              onChangeText={(text) => setCompanyForm({ ...companyForm, companyName: text })}
              placeholder="Company Name"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={companyForm.companyWebsite}
              onChangeText={(text) => setCompanyForm({ ...companyForm, companyWebsite: text })}
              placeholder="Company Website"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={companyForm.gstin}
              onChangeText={(text) => setCompanyForm({ ...companyForm, gstin: text })}
              placeholder="GSTIN"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={companyForm.pan}
              onChangeText={(text) => setCompanyForm({ ...companyForm, pan: text })}
              placeholder="PAN"
              placeholderTextColor="#888"
            />
            <Text style={styles.modalSubTitle}>Social Media Links</Text>
            <View style={styles.socialInputContainer}>
            <Ionicons name="logo-facebook" size={30} color="#4267B2" />
            <TextInput
              style={styles.modalInput}
              value={companyForm.facebook}
              onChangeText={(text) => setCompanyForm({ ...companyForm, facebook: text })}
              placeholder="Facebook Link"
              placeholderTextColor="#888"
            />
            </View>

            <View style={styles.socialInputContainer}>
            <Ionicons name="logo-instagram" size={24} color="#E4405F" />
            <TextInput
              style={styles.modalInput}
              value={companyForm.instagram}
              onChangeText={(text) => setCompanyForm({ ...companyForm, instagram: text })}
              placeholder="Instagram Link"
              placeholderTextColor="#888"
            />
            </View>

            <View style={styles.socialInputContainer}>
            <Ionicons name="logo-google" size={24} color="#DB4437" />
            <TextInput
              style={styles.modalInput}
              value={companyForm.googleBusiness}
              onChangeText={(text) => setCompanyForm({ ...companyForm, googleBusiness: text })}
              placeholder="Google Business Link"
              placeholderTextColor="#888"
            />
            </View>

            <View style={styles.socialInputContainer}>
            <Ionicons name="logo-youtube" size={24} color="#FF0000" />
            <TextInput
              style={styles.modalInput}
              value={companyForm.youtube}
              onChangeText={(text) => setCompanyForm({ ...companyForm, youtube: text })}
              placeholder="YouTube Link"
              placeholderTextColor="#888"
            />
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={handleCompanyUpdate}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsCompanyModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* Bank Modal (opens only on button click, closes properly) */}
       <Modal 
      animationType='slide'
      // transparent={true}
      visible={isBankModalVisible}
      style={styles.modal}
      onRequestClose={() => {
        setIsBankModalVisible(false);
      }}
      >
        <ScrollView style={styles.modalScroll}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Bank Account Details</Text>
            <TextInput
              style={styles.modalInput}
              value={bankForm.ifsc}
              onChangeText={(text) => setBankForm({ ...bankForm, ifsc: text })}
              placeholder="IFSC Code"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={bankForm.accountNumber}
              onChangeText={(text) => setBankForm({ ...bankForm, accountNumber: text })}
              placeholder="Account Number"
              placeholderTextColor="#888"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              value={bankForm.bankName}
              onChangeText={(text) => setBankForm({ ...bankForm, bankName: text })}
              placeholder="Bank Name"
              placeholderTextColor="#888"
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={bankForm.accountType}
                onValueChange={(itemValue) => setBankForm({ ...bankForm, accountType: itemValue })}
                style={styles.picker}
              >
                <Picker.Item label="Savings" value="Savings" />
                <Picker.Item label="Current" value="Current" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            <TextInput
              style={styles.modalInput}
              value={bankForm.bankBranchAddress}
              onChangeText={(text) => setBankForm({ ...bankForm, bankBranchAddress: text })}
              placeholder="Bank Branch Address"
              placeholderTextColor="#888"
              multiline
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleBankUpdate}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsBankModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default ProfileScreen;