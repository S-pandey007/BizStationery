import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../style/ProductCustomizationStyle';
// const BASE_URL = "http://192.168.245.3:8001";
import   Constant from 'expo-constants'
const BASE_URL = Constant.expoConfig.extra.API_URL;
console.log(BASE_URL)

const ProductCustomizationRequest = ({ route }) => {
  const id = route.params.id;
  console.log(id);
  
  const navigation = useNavigation();
  const [customizationDetails, setCustomizationDetails] = useState('');
  const [requestStatus, setRequestStatus] = useState('Pending');
  const [wholesalerMessage, setWholesalerMessage] = useState('Awaiting wholesaler response...');
  const [product, setProduct] = useState("");
  const [selectedImages, setSelectedImages] = useState([]); // State for selected images

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}product/${id}`);
      const data = await response.json();
      console.log("data from API", data.product.name);
      setProduct(data.product);
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log("product :", product);
  //   console.log("product name:", product.product_name);
  // }, [product]);

  // Function to pick multiple images
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

  // Function to remove an image
  const removeImage = (uri) => {
    setSelectedImages(prevImages => prevImages.filter(image => image.uri !== uri));
  };

  // Handle sending customization request with images
  const handleSendRequest = async () => {
    if (!customizationDetails.trim() && selectedImages.length === 0) {
      alert('Please provide customization details or select at least one image.');
      return;
    }

    setRequestStatus('Pending');
    setWholesalerMessage('Your request has been sent to the wholesaler. Waiting for response...');

    // Prepare data to send (e.g., to a backend)
    const requestData = {
      product: product.product_name,
      details: customizationDetails,
      images: selectedImages.map(image => ({
        uri: image.uri,
        name: image.fileName,
      })),
    };
    console.log('Customization request sent:', requestData);

    // Simulate sending to backend (replace with actual API call)
    // e.g., await fetch('your-api-endpoint', { method: 'POST', body: JSON.stringify(requestData) });

    setCustomizationDetails('');
    setSelectedImages([]); // Clear images after sending
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Customize Product</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Information */}
        <TouchableOpacity
           onPress={() => {
            // console.log("Navigating to ProductDetail with id:", item.id);
            navigation.navigate("ProductDetail", { product: product._id });
          }}
          style={styles.productSection}
        >
          <Text style={styles.sectionTitle}>Selected Product</Text>
          <Text style={styles.productName}>{product.name || "Loading..."}</Text>
        </TouchableOpacity>

        {/* Customization Request Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Customization Details</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., color, size, features"
            placeholderTextColor="#888"
            multiline
            value={customizationDetails}
            onChangeText={setCustomizationDetails}
          />

          {/* Image Selection */}
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImages}>
            <Ionicons name="image-outline" size={20} color="#007AFF" />
            <Text style={styles.imagePickerText}>Add Images</Text>
          </TouchableOpacity>

          {/* Image Previews */}
          {selectedImages.length > 0 && (
            <FlatList
              data={selectedImages}
              renderItem={renderImageItem}
              keyExtractor={item => item.uri}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageList}
            />
          )}

          <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
            <Text style={styles.sendButtonText}>Send Request</Text>
          </TouchableOpacity>
        </View>

        {/* Request Status */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Request Status</Text>
          <View style={styles.statusContainer}>
            <Ionicons
              name={
                requestStatus === "Pending"
                  ? "time-outline"
                  : requestStatus === "Accepted"
                  ? "checkmark-circle-outline"
                  : "close-circle-outline"
              }
              size={24}
              color={
                requestStatus === "Pending"
                  ? "#FFA726"
                  : requestStatus === "Accepted"
                  ? "#4CAF50"
                  : "#EF5350"
              }
            />
            <Text style={styles.statusText}>{requestStatus}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


export default ProductCustomizationRequest;