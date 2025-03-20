import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
} from "react-native";
import styles from "../style/LoginStyle";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../AuthProvider";
import Constant from "expo-constants";

const BASE_URL = Constant.expoConfig.extra.API_URL;

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async () => {
    setIsLoading(true);
    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        ToastAndroid.showWithGravity(
          "Please enter an email!",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }

      // Validate email syntax
      if (!validateEmail(trimmedEmail)) {
        ToastAndroid.showWithGravity(
          "Please enter a valid email address!",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }

      const savedUserData = await AsyncStorage.getItem("userData");
      if (!savedUserData) {
        ToastAndroid.showWithGravity(
          "No user data found! Please register first.",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }

      const parsedData = JSON.parse(savedUserData);
      console.log("User data retrieved from AsyncStorage:", parsedData);

      const storedEmail = parsedData?.email?.trim();
      if (trimmedEmail !== storedEmail) {
        console.log("Email not matched");
        ToastAndroid.showWithGravity(
          "Email not found in storage!",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }

      // Send OTP request to backend
      const response = await fetch(`${BASE_URL}user/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      console.log("OTP sent:", data);
      setShowOtpInput(true);
      ToastAndroid.showWithGravity(
        "Enter the OTP sent to your email!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      ToastAndroid.showWithGravity(
        `Error: ${error.message}`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    try {
      const trimmedOtp = otp.trim();
      if (!trimmedOtp) {
        ToastAndroid.showWithGravity(
          "Please enter the OTP!",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }

      // Verify OTP with backend
      const response = await fetch(`${BASE_URL}user/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: trimmedOtp }),
      });
      const data = await response.json();

      if (!response.ok || !data.result) {
        throw new Error(data.message || "Invalid OTP");
      }

      const savedUserData = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(savedUserData);

      login(userData); // Update global auth state
      setEmail("");
      setOtp("");
      setShowOtpInput(false);
      ToastAndroid.showWithGravity(
        "Logged In!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      ToastAndroid.showWithGravity(
        `Error: ${error.message}`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.background}>
        <Text style={styles.title}>Login</Text>

        {!showOtpInput ? (
          <>
            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />

            {/* Submit Email Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleEmailSubmit}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Sending OTP..." : "Submit Email"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* OTP Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor="#888"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              editable={!isLoading}
            />

            {/* Submit OTP Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleOtpSubmit}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;