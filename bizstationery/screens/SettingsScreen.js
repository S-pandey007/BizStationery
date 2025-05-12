import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../style/SettingsStyle";

const SettingsScreen = () => {
  const navigation = useNavigation();

  // State for theme, notifications, and language
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("English");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  // Dummy user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  // Theme toggle handler
  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  // Notification toggle handler
  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  // Simulated actions
  const handleChangePassword = () => {
    Alert.alert("Change Password", "Password change feature is under development.");
  };

  const handleLogOut = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => Alert.alert("Logged Out", "You have been logged out.") },
    ]);
  };

  // Language change handler
  const changeLanguage = (lang) => {
    setLanguage(lang);
    setLanguageModalVisible(false);
    Alert.alert("Language Changed", `Language set to ${lang}.`);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkTheme && styles.darkContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={isDarkTheme ? "#FFF" : "#6B48FF"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkTheme && styles.darkText]}>Settings</Text>
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.content}>
        {/* Account Settings */}
        {/* <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkTheme && styles.darkText]}>
            Account Settings
          </Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, isDarkTheme && styles.darkText]}>
              Name: {user.name}
            </Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, isDarkTheme && styles.darkText]}>
              Email: {user.email}
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogOut}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View> */}

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkTheme && styles.darkText]}>
            Notification Preferences
          </Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, isDarkTheme && styles.darkText]}>
              Enable Notifications
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#6B48FF" }}
              thumbColor={notificationsEnabled ? "#FFF" : "#F4F3F4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
            />
          </View>
        </View>

        {/* Theme Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkTheme && styles.darkText]}>
            Theme Settings
          </Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, isDarkTheme && styles.darkText]}>
              Dark Mode
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#6B48FF" }}
              thumbColor={isDarkTheme ? "#FFF" : "#F4F3F4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkTheme}
            />
          </View>
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkTheme && styles.darkText]}>
            Language
          </Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setLanguageModalVisible(true)}
          >
            <Text style={[styles.settingLabel, isDarkTheme && styles.darkText]}>
              Current Language: {language}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={isDarkTheme ? "#FFF" : "#6B48FF"} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkTheme && styles.darkText]}>About</Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, isDarkTheme && styles.darkText]}>
              App Version: 1.0.0
            </Text>
          </View>
          {/* <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, isDarkTheme && styles.darkText]}>
              Description: Manage your products and complaints easily.
            </Text>
          </View> */}
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, isDarkTheme && styles.darkText]}>
              Contact: support@example.com
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={languageModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkTheme && styles.darkText]}>
                Select Language
              </Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <Ionicons name="close" size={24} color={isDarkTheme ? "#FFF" : "#6B48FF"} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {["English", "Spanish", "Hindi"].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={styles.languageOption}
                  onPress={() => changeLanguage(lang)}
                >
                  <Text style={[styles.languageText, isDarkTheme && styles.darkText]}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};



export default SettingsScreen;