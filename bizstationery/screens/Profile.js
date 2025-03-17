import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Linking,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import * as Animatable from 'react-native-animatable';
import styles from '../style/ProfileStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import   Constant from 'expo-constants'
const BASE_URL = Constant.expoConfig.extra.API_URL;
console.log(BASE_URL)
const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isCompanyModalVisible, setIsCompanyModalVisible] = useState(false);
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [localProfileLink, setLocalProfileLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    address: { street: '', city: '', state: '' },
    mobile: '',
  });
  const [companyForm, setCompanyForm] = useState({});
  const [bankForm, setBankForm] = useState({});

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await loadLocalData();
      await fetchProfileFromAPI();
      setIsLoading(false);
    };
    initializeData();
  }, []);

  const fetchProfileFromAPI = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) return;
  
      const response = await fetch(`${BASE_URL}retailer/profile/${email}`);
      const result = await response.json();
      if (result.success) {
        const data = {
          ...result.data,
          address: result.data.address || { street: '', city: '', state: '' },
          company: result.data.company || {},
          bank: result.data.bank || {},
          onlinePresence: result.data.onlinePresence || { socialLinks: {} },
        };
        setUserData(data);
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        setProfileForm({
          ...data,
          address: data.address,
          mobile: data.mobile ? data.mobile.replace('+91', '') : '',
        });
        setCompanyForm({
          companyName: data.company?.name || '',
          companyWebsite: data.onlinePresence?.companyWebsite || '',
          gstin: data.company?.gstin || '',
          pan: data.company?.pan || '',
          facebook: data.onlinePresence?.socialLinks?.facebook || '',
          instagram: data.onlinePresence?.socialLinks?.instagram || '',
          youtube: data.onlinePresence?.socialLinks?.youtube || '',
        });
        setBankForm({
          ifsc: data.bank?.ifsc || '',
          accountNumber: data.bank?.accountNumber || '',
          bankName: data.bank?.bankName || '',
          accountType: data.bank?.accountType || 'Savings',
          bankBranchAddress: data.bank?.branchAddress || '',
        });
      }
    } catch (error) {
      console.log('Fetch API error:', error);
    }
  };
  
  const loadLocalData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      const storedProfile = await AsyncStorage.getItem('userProfile');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        setProfileForm({
          ...parsedData,
          address: parsedData.address || { street: '', city: '', state: '' },
          mobile: parsedData.mobile ? parsedData.mobile.replace('+91', '') : '',
        });
        setCompanyForm({
          companyName: parsedData.company?.name || '',
          companyWebsite: parsedData.onlinePresence?.companyWebsite || '',
          gstin: parsedData.company?.gstin || '',
          pan: parsedData.company?.pan || '',
          facebook: parsedData.onlinePresence?.socialLinks?.facebook || '',
          instagram: parsedData.onlinePresence?.socialLinks?.instagram || '',
          youtube: parsedData.onlinePresence?.socialLinks?.youtube || '',
        });
        setBankForm({
          ifsc: parsedData.bank?.ifsc || '',
          accountNumber: parsedData.bank?.accountNumber || '',
          bankName: parsedData.bank?.bankName || '',
          accountType: parsedData.bank?.accountType || 'Savings',
          bankBranchAddress: parsedData.bank?.branchAddress || '',
        });
      }
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setLocalProfileLink(parsedProfile.profileImage || '');
      }
    } catch (error) {
      console.log('Error loading local data:', error);
    }
  };

  const saveData = async (data) => {
    try {
      const response = await fetch(`${BASE_URL}retailer/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to save data');
      }
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      return true;
    } catch (error) {
      console.log('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to save data');
      return false;
    }
  };

  useEffect(() => {
    if (userData) {
      const { name, mobile, email, address } = userData;
      if (!name || !mobile || !email || !address?.street || !address?.city || !address?.state) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
      }
    }
  }, [userData]);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Needed', 'Please allow access to photos.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        const imageUri = pickerResult.assets[0].uri;
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'profileImage.jpg',
        });
        formData.append('upload_preset', 'auth_app');
        formData.append('cloud_name', 'do9zifunn');

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/do9zifunn/image/upload',
          { method: 'POST', body: formData }
        );
        const result = await response.json();
        if (result.secure_url) {
          setProfileForm((prev) => ({ ...prev, profileImage: result.secure_url }));
          await storeProfileImage(result.secure_url);
        } else {
          Alert.alert('Error', 'Failed to upload image to Cloudinary.');
        }
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const storeProfileImage = async (link) => {
    try {
      const userProfile = { profileImage: link };
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      setLocalProfileLink(link);
    } catch (error) {
      console.log('Error storing profile image:', error);
    }
  };

  const handleProfileUpdate = async () => {
    const mobileWithPrefix = `+91${profileForm.mobile}`;
    if (
      !profileForm.name ||
      !profileForm.mobile ||
      !profileForm.email ||
      !profileForm.address.street ||
      !profileForm.address.city ||
      !profileForm.address.state ||
      !/^[6-9]\d{9}$/.test(profileForm.mobile)
    ) {
      Alert.alert('Error', 'Please fill all required fields with a valid 10-digit mobile number starting with 6-9.');
      return;
    }

    const updatedData = {
      ...userData,
      ...profileForm,
      mobile: mobileWithPrefix,
      address: {
        street: profileForm.address.street,
        city: profileForm.address.city,
        state: profileForm.address.state,
      },
    };
    const success = await saveData(updatedData);
    if (success) {
      setUserData(updatedData);
      setIsProfileModalVisible(false);
    }
  };

  const handleCompanyUpdate = async () => {
    if (!companyForm.companyName || !companyForm.companyWebsite || !companyForm.gstin || !companyForm.pan) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    const updatedData = {
      ...userData,
      company: {
        name: companyForm.companyName,
        gstin: companyForm.gstin,
        pan: companyForm.pan,
      },
      onlinePresence: {
        ...userData?.onlinePresence,
        companyWebsite: companyForm.companyWebsite,
        socialLinks: {
          facebook: companyForm.facebook || '',
          instagram: companyForm.instagram || '',
          youtube: companyForm.youtube || '',
        },
      },
    };
    const success = await saveData(updatedData);
    if (success) {
      setUserData(updatedData);
      setIsCompanyModalVisible(false);
    }
  };
  
  const handleBankUpdate = async () => {
    if (!bankForm.ifsc || !bankForm.accountNumber || !bankForm.bankName || !bankForm.accountType) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    const updatedData = {
      ...userData,
      bank: {
        ifsc: bankForm.ifsc,
        accountNumber: bankForm.accountNumber,
        bankName: bankForm.bankName,
        accountType: bankForm.accountType,
        branchAddress: bankForm.bankBranchAddress || '',
      },
    };
    const success = await saveData(updatedData);
    if (success) {
      setUserData(updatedData);
      setIsBankModalVisible(false);
    }
  };

  const openUrl = (url) => {
    if (url && url.trim() !== '') {
      Linking.openURL(url).catch((err) => {
        console.log('Error opening URL:', err);
        Alert.alert('Error', 'Could not open the link.');
      });
    } else {
      Alert.alert('Info', 'No link provided.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log(userData.bank?.ifsc);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: localProfileLink  }}
          style={styles.profileImage}
          onError={(e) => console.log('Image load error:', e)}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{userData?.name || 'Not set'}</Text>
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#666" /> {userData?.location || 'Not set'}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsProfileModalVisible(true)}>
          <Ionicons name="pencil-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {showAlert && (
        <Animatable.View
          animation="slideInDown"
          duration={600}
          style={styles.alertBox}
          easing="ease-out"
          useNativeDriver={true}
        >
          <Text style={styles.alertText}>
            📢 Update your profile for better communication!
          </Text>
        </Animatable.View>
      )}

      <Modal animationType="slide" visible={isProfileModalVisible} onRequestClose={() => setIsProfileModalVisible(false)}>
        <ScrollView style={styles.modalScroll}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerText}>
                {profileForm.profileImage?.startsWith('https://') ? 'Change Profile Image' : 'Select Profile Image'}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.modalInput}
              value={profileForm.name || ''}
              onChangeText={(text) => setProfileForm({ ...profileForm, name: text })}
              placeholder="Name"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={profileForm.location || ''}
              onChangeText={(text) => setProfileForm({ ...profileForm, location: text })}
              placeholder="Location"
              placeholderTextColor="#888"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 10, fontSize: 16 }}>+91</Text>
              <TextInput
                style={[styles.modalInput, { flex: 1 }]}
                value={profileForm.mobile || ''}
                onChangeText={(text) => setProfileForm({ ...profileForm, mobile: text })}
                placeholder="Mobile Number (10 digits)"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            <TextInput
              style={styles.modalInput}
              value={profileForm.email || ''}
              onChangeText={(text) => setProfileForm({ ...profileForm, email: text })}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.modalInput}
              value={profileForm.address.street || ''}
              onChangeText={(text) =>
                setProfileForm({ ...profileForm, address: { ...profileForm.address, street: text } })
              }
              placeholder="Street"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={profileForm.address.city || ''}
              onChangeText={(text) =>
                setProfileForm({ ...profileForm, address: { ...profileForm.address, city: text } })
              }
              placeholder="City"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={profileForm.address.state || ''}
              onChangeText={(text) =>
                setProfileForm({ ...profileForm, address: { ...profileForm.address, state: text } })
              }
              placeholder="State"
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleProfileUpdate}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsProfileModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="phone-portrait-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Primary Mobile: {userData?.mobile || 'Not set'}</Text>
            {userData?.mobile && <Text style={styles.verified}>✓</Text>}
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Primary Email: {userData?.email || 'Not set'}</Text>
            {userData?.email && <Text style={styles.verified}>✓</Text>}
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="home-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>
              Address: {userData?.address?.street || ''}, {userData?.address?.city || ''}, {userData?.address?.state || ''}
            </Text>
          </View>
        </View>

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
            <Text style={styles.infoText}>Company Name: {userData?.companyName || 'Not set'}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="globe-outline" size={20} color="blue" />
            </View>
            <Pressable onPress={() => openUrl(userData?.companyWebsite)}>
              <Text style={[styles.infoText, { fontWeight: '600', color: 'blue' }]}>
                Company Website: {userData?.companyWebsite || 'Not set'}
              </Text>
            </Pressable>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-text-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>GSTIN: {userData?.gstin || 'Not set'}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="card-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>PAN: {userData?.pan || 'Not set'}</Text>
          </View>
          <View style={styles.socialIcons}>
            <TouchableOpacity onPress={() => openUrl(userData?.socialLinks?.facebook)} style={styles.socialIcon}>
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openUrl(userData?.socialLinks?.instagram)} style={styles.socialIcon}>
              <Ionicons name="logo-instagram" size={24} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openUrl(userData?.socialLinks?.youtube)} style={styles.socialIcon}>
              <Ionicons name="logo-youtube" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>

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
            <Text style={styles.infoText}>IFSC Code: {userData.bank?.ifsc}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="keypad-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Account Number: {userData.bank?.accountNumber || 'Not set'}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="bank-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Bank Name: {userData.bank?.bankName || 'Not set'}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="wallet-outline" size={20} color="#666" />
            </View>
            <Text style={styles.infoText}>Account Type: {userData.bank?.accountType || 'Not set'}</Text>
          </View>
          {/* {userData && ( */}
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="location-outline" size={20} color="#666" />
              </View>
              <Text style={styles.infoText}>Bank Branch Address: {userData.bank?.branchAddress}</Text>
            </View>
          {/* )} */}
        </View>
      </ScrollView>

      <Modal animationType="slide" visible={isCompanyModalVisible} onRequestClose={() => setIsCompanyModalVisible(false)}>
        <ScrollView style={styles.modalScroll}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Company Information</Text>
            <TextInput
              style={styles.modalInput}
              value={companyForm.companyName || ''}
              onChangeText={(text) => setCompanyForm({ ...companyForm, companyName: text })}
              placeholder="Company Name"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={companyForm.companyWebsite || ''}
              onChangeText={(text) => setCompanyForm({ ...companyForm, companyWebsite: text })}
              placeholder="Company Website"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={companyForm.gstin || ''}
              onChangeText={(text) => setCompanyForm({ ...companyForm, gstin: text })}
              placeholder="GSTIN"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={companyForm.pan || ''}
              onChangeText={(text) => setCompanyForm({ ...companyForm, pan: text })}
              placeholder="PAN"
              placeholderTextColor="#888"
            />
            <Text style={styles.modalSubTitle}>Social Media Links</Text>
            <View style={styles.socialInputContainer}>
              <Ionicons name="logo-facebook" size={30} color="#4267B2" />
              <TextInput
                style={styles.modalInput}
                value={companyForm.facebook || ''}
                onChangeText={(text) => setCompanyForm({ ...companyForm, facebook: text })}
                placeholder="Facebook Link"
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.socialInputContainer}>
              <Ionicons name="logo-instagram" size={24} color="#E4405F" />
              <TextInput
                style={styles.modalInput}
                value={companyForm.instagram || ''}
                onChangeText={(text) => setCompanyForm({ ...companyForm, instagram: text })}
                placeholder="Instagram Link"
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.socialInputContainer}>
              <Ionicons name="logo-youtube" size={24} color="#FF0000" />
              <TextInput
                style={styles.modalInput}
                value={companyForm.youtube || ''}
                onChangeText={(text) => setCompanyForm({ ...companyForm, youtube: text })}
                placeholder="YouTube Link"
                placeholderTextColor="#888"
              />
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={handleCompanyUpdate}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsCompanyModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <Modal animationType="slide" visible={isBankModalVisible} onRequestClose={() => setIsBankModalVisible(false)}>
        <ScrollView style={styles.modalScroll}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Bank Account Details</Text>
            <TextInput
              style={styles.modalInput}
              value={bankForm.ifsc || ''}
              onChangeText={(text) => setBankForm({ ...bankForm, ifsc: text })}
              placeholder="IFSC Code"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              value={bankForm.accountNumber || ''}
              onChangeText={(text) => setBankForm({ ...bankForm, accountNumber: text })}
              placeholder="Account Number"
              placeholderTextColor="#888"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              value={bankForm.bankName || ''}
              onChangeText={(text) => setBankForm({ ...bankForm, bankName: text })}
              placeholder="Bank Name"
              placeholderTextColor="#888"
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={bankForm.accountType || 'Savings'}
                onValueChange={(itemValue) => setBankForm({ ...bankForm, accountType: itemValue })}
                style={styles.picker}
              >
                <Picker.Item label="Savings" value="Savings" />
                <Picker.Item label="Current" value="Current" />
              </Picker>
            </View>
            <TextInput
              style={styles.modalInput}
              value={bankForm.bankBranchAddress || ''}
              onChangeText={(text) => setBankForm({ ...bankForm, bankBranchAddress: text })}
              placeholder="Bank Branch Address"
              placeholderTextColor="#888"
              multiline
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleBankUpdate}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsBankModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default ProfileScreen;