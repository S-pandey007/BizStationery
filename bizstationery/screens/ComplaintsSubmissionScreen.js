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

  // State for complaints, submission modal, complaint details, and selected complaint
  const [complaints, setComplaints] = useState([]);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  // Simulated initial complaints (replace with API call if needed)
  const initialComplaints = [
    {
      id: "1",
      title: "Damaged Product",
      message: "The product arrived broken.",
      images: [{ uri: "https://via.placeholder.com/100", fileName: "image1.jpg" }],
      status: "Pending",
      date: "2025-03-10",
      wholesalerResponse: "",
    },
    {
      id: "2",
      title: "Wrong Item",
      message: "Received the wrong item.",
      images: [],
      status: "Responded",
      date: "2025-03-05",
      wholesalerResponse: "Apologies, replacement shipped.",
    },
  ];

  // Pick images using Expo Image Picker
  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Need gallery access!");
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
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  // Remove an image
  const removeImage = (uri) => {
    setSelectedImages(selectedImages.filter((img) => img.uri !== uri));
  };

  // Submit complaint
  const handleSubmitComplaint = () => {
    if (!title.trim() && !message.trim() && selectedImages.length === 0) {
      Alert.alert("Error", "Please fill at least one field (Title, Message, or Image).");
      return;
    }
    const newComplaint = {
      id: (complaints.length + 1).toString(),
      title: title || "No Title",
      message: message || "No Message",
      images: selectedImages,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      wholesalerResponse: "",
    };
    setComplaints([...complaints, newComplaint]);
    Alert.alert("Success", "Complaint submitted!");
    setTitle("");
    setMessage("");
    setSelectedImages([]);
    setSubmitModalVisible(false);
  };

  // Render image previews
  const renderImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.imagePreview} />
      <TouchableOpacity onPress={() => removeImage(item.uri)} style={styles.removeButton}>
        <Ionicons name="close-circle" size={20} color="#FF4D4D" />
      </TouchableOpacity>
    </View>
  );

  // Render complaint list item
  const renderComplaint = ({ item }) => (
    <TouchableOpacity
      style={styles.complaintCard}
      onPress={() => {
        setSelectedComplaint(item);
        setDetailModalVisible(true);
      }}
    >
      <Text style={styles.complaintTitle}>{item.title}</Text>
      <Text style={styles.complaintDate}>{item.date}</Text>
      <Text style={styles.complaintStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaints</Text>
        <TouchableOpacity onPress={() => setSubmitModalVisible(true)}>
          <Ionicons name="alert-circle-outline" size={24} color="#6B48FF" />
        </TouchableOpacity>
      </View>

      {/* Complaint List or Empty Message */}
      {complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#A0A0A0" />
          <Text style={styles.emptyText}>No complaints available.</Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderComplaint}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.complaintList}
        />
      )}

      {/* Submission Modal */}
      <Modal visible={submitModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Complaint</Text>
              <TouchableOpacity onPress={() => setSubmitModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalLabel}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter complaint title"
                value={title}
                onChangeText={setTitle}
              />
              <Text style={styles.modalLabel}>Message</Text>
              <TextInput
                style={styles.input}
                placeholder="Describe your complaint"
                multiline
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImages}>
                <Ionicons name="image-outline" size={20} color="#007AFF" />
                <Text style={styles.imagePickerText}>Add Images</Text>
              </TouchableOpacity>
              {selectedImages.length > 0 && (
                <FlatList
                  data={selectedImages}
                  renderItem={renderImageItem}
                  keyExtractor={(item) => item.uri}
                  horizontal
                  style={styles.imageList}
                />
              )}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitComplaint}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={detailModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complaint Details</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedComplaint && (
                <>
                  <Text style={styles.modalDetail}>ID: {selectedComplaint.id}</Text>
                  <Text style={styles.modalDetail}>Title: {selectedComplaint.title}</Text>
                  <Text style={styles.modalDetail}>Date: {selectedComplaint.date}</Text>
                  <Text style={styles.modalDetail}>Status: {selectedComplaint.status}</Text>
                  <Text style={styles.modalLabel}>Message:</Text>
                  <Text style={styles.modalText}>{selectedComplaint.message}</Text>
                  {selectedComplaint.images.length > 0 && (
                    <FlatList
                      data={selectedComplaint.images}
                      renderItem={({ item }) => (
                        <Image source={{ uri: item.uri }} style={styles.modalImage} />
                      )}
                      keyExtractor={(item) => item.fileName}
                      horizontal
                      style={styles.imageList}
                    />
                  )}
                  {selectedComplaint.wholesalerResponse && (
                    <>
                      <Text style={styles.modalLabel}>Wholesaler Response:</Text>
                      <Text style={styles.modalText}>{selectedComplaint.wholesalerResponse}</Text>
                    </>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};



export default ComplaintsSubmissionScreen;