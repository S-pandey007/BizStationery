import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  ToastAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../style/RegistrationStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Constant from 'expo-constants';
const BASE_URL = Constant.expoConfig.extra.API_URL;
// console.log(BASE_URL);

// functional components for Contact Details and GSTIN Details
const ContactDetail = ({
  handleVerifyOTP,
  handleSentOTP,
  formData,
  setFormData,
  OTPVerification,
  errors,
  setErrors,
  setGSTINToogel,
  validateContactInfo,
}) => {
  const [otpToogle, setOTPToogle] = useState(false);

  return (
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
      {errors.phoneNumber && (
        <Text style={styles.errorText}>{errors.phoneNumber}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#AAA"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <Text style={[styles.errorText, { color: "#423CF5" }]}>
        *We will send you an OTP for email verification
      </Text>

      {/* send OTP to email button */}
      <Pressable
        onPress={() => {
          setOTPToogle(true);
          handleSentOTP();
        }}
        style={styles.sendOTPButton}
      >
        <Text
          style={[
            styles.errorText,
            { color: "#fff", fontWeight: "600", padding: 5 },
          ]}
        >
          Send OTP
        </Text>
      </Pressable>

      {otpToogle && (
        <OTPVerification
          email={formData.email}
          setGSTINToogel={setGSTINToogel}
          setOTPToogle={setOTPToogle}
          handleVerifyOTP={handleVerifyOTP}
        />
      )}
    </View>
  );
};

const OTPVerification = ({ email, setOTPToogle, handleVerifyOTP }) => {
  const [otp, setOTP] = useState("");
  console.log(email);
  console.log(otp);
  return (
    <View style={[styles.section, { marginTop: 7 }]}>
      <TextInput
        style={styles.input}
        placeholder="enter 6 digit OTP"
        placeholderTextColor="#AAA"
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={(text) => setOTP(text)}
      />
      {/* verify OTP button */}
      <Pressable
        onPress={() => {
          if (handleVerifyOTP(otp, email)) {
            setOTPToogle(false);
            setOTP("");
          }
        }}
        style={styles.sendOTPButton}
      >
        <Text
          style={[
            styles.errorText,
            { color: "#fff", fontWeight: "600", padding: 5 },
          ]}
        >
          Verify OTP
        </Text>
      </Pressable>
    </View>
  );
};

const GSTINDetail = ({
  formData,
  setFormData,
  setGSTINToogel,
  errors,
  handleSubmit,
  handleGSTINVefication,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>GSTIN (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="GSTIN Number"
        placeholderTextColor="#AAA"
        maxLength={15}
        value={formData.gstin}
        onChangeText={(text) =>
          setFormData({ ...formData, gstin: text.toUpperCase() })
        }
      />

      {/* verify GSTIN button */}
      <Pressable
        onPress={() => {
          handleGSTINVefication();
        }}
        style={styles.gstinButton}
      >
        <Text
          style={[
            styles.errorText,
            { color: "#fff", fontWeight: "600", padding: 5 },
          ]}
        >
          Verify GSTIN
        </Text>
      </Pressable>


      
      {/* Register button - fixing this to ensure handleSubmit gets called */}
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={["#423CF5", "#6A48F5"]}  // Changed colors to make button more visible
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// Main Registration Screen
const RegistrationScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    pinCode: "",
    phoneNumber: "",
    email: "",
    gstin: "",
  });
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});
  const [contactToogel, setContactToogel] = useState(false);
  const [GSTINtoogel, setGSTINToogel] = useState(false);

  // Validation functions
  const validatePersonalInfo = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.businessName)
      newErrors.businessName = "Business name is required";
    if (!/^\d{6}$/.test(formData.pinCode))
      newErrors.pinCode = "Enter a valid 6-digit PIN";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContactInfo = () => {
    let newErrors = {};
    if (!/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Enter a valid 10-digit number";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePersonalNext = () => {
    if (validatePersonalInfo()) {
      setContactToogel(true);
    }
  };

  // method to send OTP
  const handleSentOTP = async () => {
    console.log("OTP sent to email");
    const email = formData.email;
    console.log(email);
    try {
      const response = await fetch(`${BASE_URL}user/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        ToastAndroid.showWithGravity(
          "OTP Sent Successfully!",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  const handleVerifyOTP = async (otp, email) => {
    if (!email) {
      Alert.alert("Error", "Email is required");
      return false;
    }

    console.log(otp);
    console.log(email);
    try {
      const response = await fetch(`${BASE_URL}user/verifyotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        ToastAndroid.showWithGravity(
          "OTP Verified Successfully!",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        setGSTINToogel(true);
        return true;
      } else {
        Alert.alert(
          "Error",
          data.message || "OTP verification failed"
        );
        return false;
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      Alert.alert("Error", "OTP verification failed");
      return false;
    }
  };

  const handleGSTINVefication = async () => {
    const gstin = formData.gstin;
    console.log("GSTIN verification started");

    if (!gstin) {
      ToastAndroid.showWithGravity(
        "GSTIN required!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}user/gstin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gstin }),
      });

      const data = await response.json();
      console.log("GSTIN Response:", data);

      if (response.ok) {
        ToastAndroid.showWithGravity(
          "GSTIN Verified Successfully!",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        ToastAndroid.showWithGravity(
          "Invalid GSTIN",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
    } catch (error) {
      console.error("GSTIN Verification Error:", error);
      ToastAndroid.showWithGravity(
        "GSTIN verification failed. Please try again.",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
  };

  // Submit form
  const handleSubmit = async () => {
    console.log("Handle Submit Called");  // Debug log
    
    // Add form validation before submitting
    if (!validatePersonalInfo() || !validateContactInfo()) {
      Alert.alert("Error", "Please check form for errors");
      return;
    }

    try {
      console.log("Form Submitted:", formData);
      
      // Trim and ensure data is in correct format before saving
      const email = formData.email.trim();
      const phone = formData.phoneNumber.trim();
      const gstin = formData.gstin.trim();
      const name = formData.name.trim();
      const businessName = formData.businessName.trim();
      const pinCode = formData.pinCode.trim();
  
      const response = await fetch(`${BASE_URL}retailer/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          mobile: phone,
          name: name,
          gstin: gstin,
          businessName: businessName,
          pin: pinCode
        })
      });

      const result = await response.json();
      console.log("Registration Response:", result);
      
      if (response.ok) {
        ToastAndroid.showWithGravity(
          "Registration Successful!",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );

        // Reset form data and errors after successful registration
        setFormData({
          name: "",
          businessName: "",
          pinCode: "",
          phoneNumber: "",
          email: "",
          gstin: "",
        });
        setErrors({});
        
        // Navigate to Login screen
        navigation.navigate("Login");
      } else {
        // Handle API errors
        Alert.alert("Registration Error", result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Retailer Registration</Text>
          </View>
      <View style={styles.gradientBackground}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          
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
              onChangeText={(text) =>
                setFormData({ ...formData, businessName: text })
              }
            />
            {errors.businessName && (
              <Text style={styles.errorText}>{errors.businessName}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="PIN Code"
              placeholderTextColor="#AAA"
              keyboardType="numeric"
              maxLength={6}
              value={formData.pinCode}
              onChangeText={(text) =>
                setFormData({ ...formData, pinCode: text })
              }
            />
            {errors.pinCode && (
              <Text style={styles.errorText}>{errors.pinCode}</Text>
            )}

            <Pressable
              onPress={handlePersonalNext}
              style={styles.nextBottonContainer}
            >
              <Text style={styles.nextBottonText}>Next</Text>
            </Pressable>
          </View>

          {/* Contact Details */}
          {contactToogel && (
            <ContactDetail
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              setGSTINToogel={setGSTINToogel}
              validateContactInfo={validateContactInfo}
              OTPVerification={OTPVerification}
              handleSentOTP={handleSentOTP}
              handleVerifyOTP={handleVerifyOTP}
            />
          )}

          {/* GSTIN Details */}
          {GSTINtoogel && (
            <GSTINDetail
              formData={formData}
              setFormData={setFormData}
              setGSTINToogel={setGSTINToogel}
              errors={errors}
              handleSubmit={handleSubmit}
              handleGSTINVefication={handleGSTINVefication}
            />
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegistrationScreen;