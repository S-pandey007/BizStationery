import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import styles from "../style/MessageStyle";

const MessageScreen = () => {
  const navigation = useNavigation();
    const [selectedImages, setSelectedImages] = useState([]); // State for selected images

  // Hardcoded chat messages for simplicity
  const chatMessages = [
    {
      id: "1",
      text: "I viewed your 350W Ceiling Fan Stator Winding Machine on 23 Feb, 11:53 pm",
      sender: "user",
      timestamp: "24 Feb",
    },
    {
      id: "2",
      text: "Thank you for showing interest in our product.\n\nSanghani Electricals, Rajkot (Gujrat)\nCeiling Fan Winding Machine\n\nKishorbhai Sanghani +91 9824840127",
      sender: "wholesaler",
      timestamp: "24 Feb",
    },
    {
      id: "3",
      text: "Hi Kishorbhai, can you call me?",
      sender: "user",
      timestamp: "24 Feb",
    },
  ];

  // Hardcoded latest messages for preview
  const latestMessages = [
    {
      id: "1",
      text: "New offer on Ceiling Fan Winding Machine!",
      sender: "wholesaler",
      timestamp: "25 Feb, 10:00 AM",
    },
    {
      id: "2",
      text: "Confirm your order details.",
      sender: "wholesaler",
      timestamp: "25 Feb, 9:45 AM",
    },
  ];

  // State for the message input
  const [message, setMessage] = useState("");

  // Functions to handle call, message, and email actions
  const handleCall = () => {
    Linking.openURL("tel:+919770337151");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:shubhampandey8663@gmail.com");
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage(""); // Clear input after sending (placeholder logic)
    }
  };


  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.wholesalerMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  const renderLatestMessage = ({ item }) => (
    <View style={styles.latestMessageContainer}>
      <Text style={styles.latestMessageText}>{item.text}</Text>
      <Text style={styles.latestTimestamp}>{item.timestamp}</Text>
    </View>
  );

  const pickImages = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access gallery is required!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true, // Enable multiple selection
        quality: 1,
      });
  
      if (!result.canceled) {
        const newImages = result.assets.map(asset => ({
          uri: asset.uri,
          fileName: asset.fileName || `image-${Date.now()}.jpg`,
        }));
        setSelectedImages(prevImages => [...prevImages, ...newImages]);
      }
    };

    console.log(selectedImages);
    
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>MH Traders</Text>
          {/* <Text style={styles.headerSubtitle}>Rajkot, Gujarat • ⭐ 4.4</Text> */}
        </View>
        <TouchableOpacity onPress={handleCall}>
          <Ionicons name="call" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Latest Messages Section */}
      <FlatList
        data={latestMessages}
        renderItem={renderLatestMessage}
        keyExtractor={(item) => item.id}
        horizontal
        style={styles.latestMessages} // Move style to FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 8 }} // Add padding if needed
      />

      {/* Chat Area */}
      <FlatList
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Ionicons name="call-outline" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSendMessage}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
          <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Email</Text>
        </TouchableOpacity>
      </View>

      {/* Message Input with File/Media Options */}
      <View style={styles.inputContainer}>
        <View style={styles.inputOptions}>
          <TouchableOpacity onPress={pickImages} style={styles.optionButton}>
            <Ionicons name="image" size={30} color="#6B48FF" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Write a message..."
          placeholderTextColor="#A0A0A0"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!message.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={message.trim() ? "#FFFFFF" : "#A0A0A0"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MessageScreen;
