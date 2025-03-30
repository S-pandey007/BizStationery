import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../style/ProductCustomizationStyle';
import Constant from 'expo-constants';
const BASE_URL = Constant.expoConfig.extra.API_URL;

const ProductCustomizationRequest = ({ route }) => {
  // const id = route.params.id;
  const { id:id, orderId: navigatedOrderId } = route.params;
  console.log("id ",id);
  console.log("navigatedOrderId : ",navigatedOrderId);
  
  const navigation = useNavigation();
  const [customizationDetails, setCustomizationDetails] = useState('');
  const [requestStatus, setRequestStatus] = useState('Pending');
  const [wholesalerMessage, setWholesalerMessage] = useState('Awaiting wholesaler response...');
  const [product, setProduct] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [orderId, setOrderId] = useState(navigatedOrderId || ''); // Fixed: default empty string
  const [orderError, setOrderError] = useState('Verification in Proccess wait...');
  const [orderSuccess, setOrderSuccess] = useState(null); // New: success message
  const [retailerId, setRetailerId] = useState(''); // Fixed: default empty string
  const [isLoading, setIsLoading] = useState(false);


  // Fetch retailerId and product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (!storedData) throw new Error('No user data in storage');
        const parsedData = JSON.parse(storedData);
        setRetailerId(parsedData.id);

        const response = await fetch(`${BASE_URL}product/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error('Failed to fetch product');
        setProduct(data.product);
      } catch (error) {
        console.error('Fetch error:', error);
        ToastAndroid.show('Failed to load data', ToastAndroid.SHORT);
      }
    };
    fetchData();
  },[id, navigatedOrderId]);

  // Pick images (unchanged)
  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      ToastAndroid.show('Gallery permission required', ToastAndroid.SHORT);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
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

  // Remove image (unchanged)
  const removeImage = (uri) => {
    setSelectedImages(prevImages => prevImages.filter(image => image.uri !== uri));
  };

  // Validate order
  const validateOrder = async () => {
    if (!orderId) {
      setOrderError(null);
      setOrderSuccess(null);
      return true; // Optional field
    }
    try {
      const response = await fetch(`${BASE_URL}order/verifyOrder?orderId=${orderId}&userId=${retailerId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      

      if (!response.ok || !data.order) {
        setOrderError('Order not found');
        setOrderSuccess(null);
        return false;
      }
      if (data.order.orderStatus !== 'Pending') {
        setOrderError('Order must be Pending for customization');
        setOrderSuccess(null);
        return false;
      }
      setOrderError(null);
      setOrderSuccess('Order verified');
      return true;
    } catch (error) {
      setOrderError('Error validating order');
      setOrderSuccess(null);
      return false;
    }
  };

  // Handle sending request
  const handleSendRequest = async () => {
    if (!customizationDetails.trim() && selectedImages.length === 0) {
      ToastAndroid.show('Add details or images', ToastAndroid.SHORT);
      return;
    }

    // Validate orderId
    const isOrderValid = await validateOrder();
    if (!isOrderValid) {
      ToastAndroid.show(orderError, ToastAndroid.SHORT);
      return;
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const image of selectedImages) {
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: 'image/jpeg',
        name: image.fileName,
      });
      formData.append('upload_preset', 'auth_app'); // Replace with your preset
      formData.append('cloud_name', 'do9zifunn');   // Your Cloudinary cloud name

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/do9zifunn/image/upload',
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      if (data.secure_url) {
        imageUrls.push(data.secure_url);
      } else {
        ToastAndroid.show('Image upload failed', ToastAndroid.SHORT);
        return;
      }
    }

    // Send request to API
    const requestData = {
      productId: id,
      retailerId,
      orderId: orderId || null,
      details: customizationDetails,
      images: imageUrls,
    };

    try {
      const response = await fetch(`${BASE_URL}customization/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (response.ok) {
        ToastAndroid.show('Request sent successfully', ToastAndroid.SHORT);
        setRequestStatus('Pending');
        setWholesalerMessage('Your request has been sent to the wholesaler.');
        setCustomizationDetails('');
        setSelectedImages([]);
        setOrderId('');
        setOrderSuccess(null);
      } else {
        ToastAndroid.show(data.error || 'Failed to send request', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error sending request:', error);
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    }
  };

  useEffect(()=>{
    validateOrder(orderId); 
  },[orderId,retailerId])

  // Render image item (unchanged)
  const renderImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.imagePreview} />
      <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(item.uri)}>
        <Ionicons name="close-circle" size={20} color="#FF4D4D" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Customize Product</Text>
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetail', { product: product._id })}
          style={styles.productSection}
        >
          <Text style={styles.sectionTitle}>Selected Product</Text>
          <Text style={styles.productName}>{product.name || 'Loading...'}</Text>
        </TouchableOpacity>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Order ID (Optional)</Text>
          <TextInput
            style={[styles.input, { minHeight: 30 }]}
            placeholder="Enter Order ID"
            value={orderId}
            onChangeText={(text) => {
              setOrderId(text);
            }}
          />

          {orderError && <Text style={styles.errorText}>{orderError}</Text>}
          {orderSuccess && <Text style={styles.successText}>{orderSuccess}</Text>}

          <Text style={styles.sectionTitle}>Customization Details</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., color, size, features"
            placeholderTextColor="#888"
            multiline
            value={customizationDetails}
            onChangeText={setCustomizationDetails}
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
              showsHorizontalScrollIndicator={false}
              style={styles.imageList}
            />
          )}
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} // Style change when disabled
            onPress={handleSendRequest}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.sendButtonText}>Send Request</Text>
            )}
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </View>
  );
};

export default ProductCustomizationRequest;