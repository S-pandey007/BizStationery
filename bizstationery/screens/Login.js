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

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [inputType, setInputType] = useState("mobile"); // 'mobile' or 'email'
  const [inputValue, setInputValue] = useState("");
  const [userData, setUserData] = useState({ email: "", phone: "" });

  const handleLogin = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem("userData");
      const userData = savedUserData ? JSON.parse(savedUserData) : null;

      if (
        userData &&
        (inputValue === userData.email || inputValue === userData.phone)
      ) {
        login(userData); // Update global auth state
        ToastAndroid.show("Logged In!", ToastAndroid.LONG);
        navigation.navigate("Home");
      } else {
        ToastAndroid.show("Invalid credentials!", ToastAndroid.LONG);
      }
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

      // Ensure trimmed input for accurate matching
      const trimmedInput = inputValue.trim();
      const storedEmail = parsedData.email.trim();
      const storedPhone = parsedData.phone.trim();

      // console.log(`(DEBUG) Mobile input: "${trimmedInput}"`);
      // console.log(`(DEBUG) Mobile stored: "${storedPhone}"`);
      // console.log(`(DEBUG) Length input: ${trimmedInput.length}, Length stored: ${storedPhone.length}`);

      // console.log(`(DEBUG) Input split:`, trimmedInput.split(''));
      // console.log(`(DEBUG) Stored split:`, storedPhone.split(''));

      if (inputType === "email") {
        if (trimmedInput === storedEmail) {
          console.log("Email matched");
          setInputValue("");
          ToastAndroid.showWithGravity(
            "Logged In!",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          navigation.navigate("Home");
        } else {
          console.log("Email not matched");
          ToastAndroid.showWithGravity(
            "Incorrect credentials!",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
        }
      } else if (inputType === "mobile") {
        if (trimmedInput === storedPhone) {
          console.log("Mobile matched");
          setInputValue("");
          ToastAndroid.showWithGravity(
            "Logged In!",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          navigation.navigate("Home");
        } else {
          console.log("Mobile not matched");
          console.log(
            `(DEBUG) ASCII Input: ${trimmedInput
              .split("")
              .map((c) => c.charCodeAt(0))}`
          );
          console.log(
            `(DEBUG) ASCII Stored: ${storedPhone
              .split("")
              .map((c) => c.charCodeAt(0))}`
          );
          ToastAndroid.showWithGravity(
            "Incorrect credentials!",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
        }
      } else {
        console.log("Invalid input");
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      ToastAndroid.showWithGravity(
        "Error logging in!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.background}>
        <Text style={styles.title}>Login</Text>

        {/* Toggle between Mobile and Email */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              inputType === "mobile" && styles.toggleButtonActive,
            ]}
            onPress={() => setInputType("mobile")}
          >
            <Text
              style={[
                styles.toggleText,
                inputType === "mobile" && styles.toggleTextActive,
              ]}
            >
              Mobile Number
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              inputType === "email" && styles.toggleButtonActive,
            ]}
            onPress={() => setInputType("email")}
          >
            <Text
              style={[
                styles.toggleText,
                inputType === "email" && styles.toggleTextActive,
              ]}
            >
              Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder={
            inputType === "mobile" ? "Enter Mobile Number" : "Enter Email"
          }
          placeholderTextColor="#888"
          keyboardType={inputType === "mobile" ? "numeric" : "email-address"}
          maxLength={inputType === "mobile" ? 10 : undefined}
          value={inputValue}
          onChangeText={setInputValue}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
