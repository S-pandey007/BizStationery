import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import styles from "../style/ComplaintsSubmissionStyle";

const ComplaintsSubmissionScreen = () => {
    const navigation = useNavigation();

  // State for modal visibility, complaint details, and images
  const [modalVisible, setModalVisible] = useState(false);
  const [complaintDetails, setComplaintDetails] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  // Function to pick multiple images
  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        fileName: asset.fileName || `image-${Date.now()}.jpg`,
      }));
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  // Function to remove an image
  const removeImage = (uri) => {
    setSelectedImages((prevImages) => prevImages.filter((image) => image.uri !== uri));
  };

  // Handle submitting the complaint
  const handleSubmitComplaint = async () => {
    if (!complaintDetails.trim() && selectedImages.length === 0) {
      Alert.alert("Error", "Please provide complaint details or upload at least one image.");
      return;
    }

    const complaintData = {
      details: complaintDetails,
      images: selectedImages,
      status: "Pending",
      date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
    };

    // Simulate API call to submit complaint
    console.log("Submitting complaint:", complaintData);
    // Replace with actual API call
    // await fetch('http://192.168.43.3:5000/api/complaints', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(complaintData),
    // });

    Alert.alert("Success", "Your complaint has been submitted!");
    setComplaintDetails("");
    setSelectedImages([]);
    setModalVisible(false);

  };

  // Render image previews
  const renderImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.imagePreview} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeImage(item.uri)}
      >
        <Ionicons name="close-circle" size={20} color="#FF4D4D" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
        <Text style={styles.headerTitle}>Submit a Complaint</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="alert-circle-outline" size={24} color="#6B48FF" />
        </TouchableOpacity>
      </View>

      

      {/* Complaint Submission Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Complaint</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalLabel}>Complaint Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Describe your complaint..."
                placeholderTextColor="#888"
                multiline
                value={complaintDetails}
                onChangeText={setComplaintDetails}
              />

              {/* Image Upload */}
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImages}>
                <Ionicons name="image-outline" size={20} color="#007AFF" />
                <Text style={styles.imagePickerText}>Add Images</Text>
              </TouchableOpacity>

              {/* Image Previews */}
              {selectedImages.length > 0 && (
                <FlatList
                  data={selectedImages}
                  renderItem={renderImageItem}
                  keyExtractor={(item) => item.uri}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageList}
                />
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitComplaint}>
                <Text style={styles.submitButtonText}>Submit Complaint</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


export default ComplaintsSubmissionScreen;