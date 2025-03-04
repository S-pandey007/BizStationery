import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import styles from '../style/ProductCustomizationStyle';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';


const ProductCustomizationRequest = ({route}) => {
  const id = route.params.id;
  console.log(id);
  const navigation = useNavigation();
  const [customizationDetails, setCustomizationDetails] = useState('');
  const [requestStatus, setRequestStatus] = useState('Pending'); // Initial status
  const [wholesalerMessage, setWholesalerMessage] = useState('Awaiting wholesaler response...'); // Dummy message


  const [product ,setProduct] = useState("")
  
  useEffect(()=>{
    const fetchData = async()=>{
      const response = await fetch(`http://192.168.43.3:5000/api/products/${id}`);
      const data = await response.json();
        console.log("data from API", data.product);
        setProduct(data.product);
    }
    fetchData()
  },[])

  useEffect(()=>{
    console.log("product :", product);
    console.log("product name:", product.product_name);
  },[product])
  // Handle sending customization request
  const handleSendRequest = () => {
    if (customizationDetails.trim()) {
      setRequestStatus('Pending');
      setWholesalerMessage('Your request has been sent to the wholesaler. Waiting for response...');
      // Here, you would typically send this data to a backend or context
      console.log('Customization request sent:', {
        product: productName,
        details: customizationDetails,
      });
      setCustomizationDetails(''); // Clear input after sending
    } else {
      alert('Please provide customization details before sending the request.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <AntDesign
          onPress={() => navigation.goBack()}
          name="arrowleft"
          size={24}
          color="black"
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>Product Customization</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Information */}
        <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', { product: product.id })}
        style={styles.productSection}>
          <Text style={styles.productTitle}>Selected Product</Text>
          <Text style={styles.productName}>{product.product_name}</Text>
        </TouchableOpacity>

        {/* Customization Request Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Customization Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe your customization needs (e.g., color, size, features)..."
            placeholderTextColor="#888"
            multiline
            value={customizationDetails}
            onChangeText={setCustomizationDetails}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendRequest}
          >
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
                  ? "clock-outline"
                  : requestStatus === "Accepted"
                  ? "checkmark-circle-outline"
                  : "close-circle-outline"
              }
              size={24}
              color={
                requestStatus === "Pending"
                  ? "#FFA500"
                  : requestStatus === "Accepted"
                  ? "#4CAF50"
                  : "#FF4D4D"
              }
            />
            <Text style={styles.statusText}>{requestStatus}</Text>
          </View>
        </View>

        {/* Wholesaler Message */}
        <View style={styles.messageSection}>
          <Text style={styles.sectionTitle}>Wholesaler Response</Text>
          <Text style={styles.messageText}>{wholesalerMessage}</Text>
          {requestStatus !== "Pending" && (
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductCustomizationRequest;