import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../style/RegistrationStyle';

const RegistrationScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    pinCode: '',
    phoneNumber: '',
    email: '',
    gstin: '',
  });
  const [errors, setErrors] = useState({});
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  // Validation steps
  const validatePersonalInfo = ()=>{
    let newErrors = {}
    if(!formData.name) newErrors.name='Name is required';
    if(!formData.businessName) newErrors.businessName = ' Business name is required'
    if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = 'Enter a valid 6-digit PIN';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const validateContactInfo = ()=>{
      let newErrors = {}
      if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Enter a valid 10-digit number';
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
      
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0;
    }

  const handlePersonalNext = ()=>{
    if(validatePersonalInfo()){
      setContactToogel(true)
    }
}

  const handleSubmit = () => {
    // Basic submission logic (no validation for simplicity)
    console.log('Form Submitted:', formData);
    // Reset form or navigate as needed
    setFormData({
      name: '',
      businessName: '',
      pinCode: '',
      phoneNumber: '',
      email: '',
      gstin: '',
    });
  }

  const [Contacttoogel , setContactToogel] = useState(false)
  const [GSTINtoogel , setGSTINToogel] = useState(false)

  const ContactDetail = ()=>{
    return(
      <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#AAA"
              keyboardType="numeric"
              maxLength={10}
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            />
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#AAA"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Pressable onPress={()=> setGSTINToogel(true)}  style={styles.nextBottonContainer}>
              <Text style={styles.nextBottonText}>Next</Text>
            </Pressable>
          </View>
    )
  }

  const GSTINDetail = ()=>{
    return(
      <View style={styles.section}>
      <Text style={styles.sectionTitle}>GSTIN</Text>
      <TextInput
        style={styles.input}
        placeholder="GSTIN Number"
        placeholderTextColor="#AAA"
        maxLength={15}
        value={formData.gstin}
        onChangeText={(text) => setFormData({ ...formData, gstin: text.toUpperCase() })}
      />
    

    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
      <LinearGradient
        colors={['#bdc3c7', '#bdc3c7']}
        style={styles.buttonGradient}
      >
        <Text style={styles.buttonText}>Register</Text>
      </LinearGradient>
    </TouchableOpacity>
    </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.gradientBackground}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headerTitle}>Retailer Registration</Text>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#AAA"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Business Name"
              placeholderTextColor="#AAA"
              value={formData.businessName}
              onChangeText={(text) => setFormData({ ...formData, businessName: text })}
            />
            {errors.businessName && <Text style={styles.errorText}>{errors.businessName}</Text>}

            <TextInput
              style={styles.input}
              placeholder="PIN Code"
              placeholderTextColor="#AAA"
              keyboardType="numeric"
              maxLength={6}
              value={formData.pinCode}
              onChangeText={(text) => setFormData({ ...formData, pinCode: text })}
            />
            {errors.pinCode && <Text style={styles.errorText}>{errors.pinCode}</Text>}

            
            <Pressable onPress={handlePersonalNext}  style={styles.nextBottonContainer}>
              <Text style={styles.nextBottonText}>Next</Text>
            </Pressable>
          </View>

          {/* Contact Details */}
          {
            Contacttoogel ? (
              <ContactDetail/>
            ):(
              <View></View>
            )
          }

          {/* GSTIN */}
         {
          GSTINtoogel ?(
            <GSTINDetail/>
          ):(
            <View></View>
          )
         }
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegistrationScreen;