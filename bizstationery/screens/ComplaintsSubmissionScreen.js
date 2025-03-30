import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
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
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constant from "expo-constants";

const BASE_URL = Constant.expoConfig.extra.API_URL;
console.log(BASE_URL);

const ComplaintsSubmissionScreen = () => {
  const navigation = useNavigation();

  const [complaints, setComplaints] = useState([]);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [complaintType, setComplaintType] = useState(null);
  const [step, setStep] = useState("selectType");
  const [relatedId, setRelatedId] = useState(null);
  const [orderOptions, setOrderOptions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Changed: Fetch complaints on mount
    const loadData = async () => {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserId(parsedData.id);
        fetchComplaints(parsedData.id);
      }
    };
    loadData();

    if (submitModalVisible) {
      fetchOrders();
      fetchProductCategories();
    }
  }, [submitModalVisible]);

  // Changed: Fetch complaints by retailerId
  const fetchComplaints = async (retailerId) => {
    try {
      const response = await fetch(
        `${BASE_URL}complaint?retailerId=${retailerId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch complaints");
      const data = await response.json();
      // console.log("complaint data :", data.complaints[0].images);

      setComplaints(data.complaints || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      Alert.alert("Error", "Couldn’t load complaints.");
      setComplaints([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const storeData = await AsyncStorage.getItem("userData");
      if (!storeData) throw new Error("No user data in storage");
      const parsedData = JSON.parse(storeData);
      setUserId(parsedData.id);
      const response = await fetch(`${BASE_URL}order?userId=${parsedData.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrderOptions(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Couldn’t load orders.");
      setOrderOptions([]);
    }
  };

  const fetchProductCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}category/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setProductCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Couldn’t load product categories.");
      setProductCategories([]);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `${BASE_URL}product/bycategory/${categoryId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Couldn’t load products.");
      setProducts([]);
    }
  };

  const pickImages = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Needed", "Please allow access to photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImageUrls = [];
        for (const asset of result.assets) {
          const formData = new FormData();
          formData.append("file", {
            uri: asset.uri,
            type: "image/jpeg",
            name: `complaint-image-${Date.now()}.jpg`,
          });
          formData.append("upload_preset", "auth_app"); // Replace with your preset
          formData.append("cloud_name", "do9zifunn"); // Your Cloudinary cloud name

          const response = await fetch(
            "https://api.cloudinary.com/v1_1/do9zifunn/image/upload",
            { method: "POST", body: formData }
          );
          const data = await response.json();
          if (data.secure_url) {
            newImageUrls.push(data.secure_url);
          } else {
            Alert.alert("Error", "Failed to upload an image to Cloudinary.");
          }
        }
        setSelectedImages([...selectedImages, ...newImageUrls]);
      }
    } catch (error) {
      console.error("Error picking/uploading images:", error);
      Alert.alert("Error", "Failed to upload images.");
    }
  };

  const removeImage = (url) => {
    setSelectedImages(selectedImages.filter((img) => img !== url));
  };

  // Changed: Submit to database
  const handleSubmitComplaint = async () => {
    if (!title.trim() && !message.trim() && selectedImages.length === 0) {
      Alert.alert(
        "Error",
        "Please fill at least one field (Title, Message, or Image)."
      );
      return;
    }
    if (selectedImages.length > 3) {
      Alert.alert("Error", "Maximum 3 images allowed.");
      return;
    }
    const newComplaint = {
      title: title || "No Title",
      message: message || "No Message",
      images: selectedImages ||"", // Changed: Use array of Cloudinary URLs directly
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      wholesalerResponse: "",
      complaintType,
      relatedId,
      retailerId: userId,
    };
    try {
      const response = await fetch(`${BASE_URL}complaint/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComplaint),
      });
      if (!response.ok) throw new Error("Failed to submit complaint");
      const data = await response.json();
      setComplaints([...complaints, { ...newComplaint, id: data.id }]); // Assume API returns complaint ID
      Alert.alert("Success", "Complaint submitted!");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert("Error", "Failed to submit complaint.");
    }
    setTitle("");
    setMessage("");
    setSelectedImages([]);
    setComplaintType(null);
    setRelatedId(null);
    setSelectedCategory(null);
    setProducts([]);
    setStep("selectType");
    setSubmitModalVisible(false);
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.imagePreview} />
      {/* Changed: Use URL directly */}
      <TouchableOpacity
        onPress={() => removeImage(item)}
        style={styles.removeButton}
      >
        <Ionicons name="close-circle" size={20} color="#FF4D4D" />
      </TouchableOpacity>
    </View>
  );

  const renderComplaint = ({ item }) => (
    <TouchableOpacity
      key={item._id}
      style={styles.complaintCard}
      onPress={() => {
        setSelectedComplaint(item);
        setDetailModalVisible(true);
      }}
    >
      <Text style={styles.complaintTitle}>{item.title}</Text>
      <Text style={styles.complaintDate}>{item.date}</Text>
      {
        item.status === "Pending" ? (
          <Text style={styles.complaintStatus}>{item.status}</Text> ):(
            <Text style={[styles.complaintStatus,{color:'green'}]}>{item.status}</Text>
          )
      }
      <Text style={styles.complaintDetail}>
        {item.complaintType
          ? `${
              item.complaintType.charAt(0).toUpperCase() +
              item.complaintType.slice(1)
            }: ${item.relatedId || "N/A"}`
          : "Other"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaints</Text>
        <TouchableOpacity onPress={() => setSubmitModalVisible(true)}>
          <Ionicons name="alert-circle-outline" size={28} color="#6B48FF" />
        </TouchableOpacity>
      </View>

      {complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#A0A0A0" />
          <Text style={styles.emptyText}>No complaints available.</Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderComplaint}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.complaintList}
        />
      )}

      <Modal
        visible={submitModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Complaint</Text>
              <TouchableOpacity
                onPress={() => {
                  setSubmitModalVisible(false);
                  setComplaintType(null);
                  setStep("selectType");
                  setRelatedId(null);
                  setSelectedCategory(null);
                  setProducts([]);
                  setTitle("");
                  setMessage("");
                  setSelectedImages([]);
                }}
              >
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {step === "selectType" ? (
                <View>
                  <Text style={[styles.modalLabel, { marginBottom: 10 }]}>
                    Select Complaint Type
                  </Text>
                  <TouchableOpacity
                    style={styles.typeButton}
                    onPress={() => {
                      setComplaintType("order");
                      setStep("details");
                    }}
                  >
                    <Ionicons name="cart-outline" size={20} color="#6B48FF" />
                    <Text style={styles.typeButtonText}>Order-Related</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.typeButton}
                    onPress={() => {
                      setComplaintType("product");
                      setStep("details");
                    }}
                  >
                    <Ionicons name="cube-outline" size={20} color="#6B48FF" />
                    <Text style={styles.typeButtonText}>Product-Related</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.typeButton}
                    onPress={() => {
                      setComplaintType("other");
                      setStep("complaintDetails");
                    }}
                  >
                    <Ionicons
                      name="help-circle-outline"
                      size={20}
                      color="#6B48FF"
                    />
                    <Text style={styles.typeButtonText}>Other</Text>
                  </TouchableOpacity>
                </View>
              ) : step === "details" ? (
                <View>
                  {complaintType === "order" && (
                    <>
                      <Text style={styles.modalLabel}>Select Order</Text>
                      {orderOptions.length > 0 ? (
                        <Picker
                          selectedValue={relatedId}
                          onValueChange={(itemValue) => setRelatedId(itemValue)}
                          style={styles.picker}
                        >
                          <Picker.Item label="Select an order" value={null} />
                          {orderOptions.map((order) => (
                            <Picker.Item
                              key={order.orderId}
                              label={`${order.orderId} - ₹${order.totalAmount}`}
                              value={order.orderId}
                            />
                          ))}
                        </Picker>
                      ) : (
                        <Text>Loading orders...</Text>
                      )}
                      <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => {
                          if (!relatedId) {
                            Alert.alert("Error", "Please select an order.");
                          } else {
                            setStep("complaintDetails");
                          }
                        }}
                      >
                        <Text style={styles.submitButtonText}>Next</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {complaintType === "product" && (
                    <>
                      <Text style={styles.modalLabel}>
                        Select Product Category
                      </Text>
                      {productCategories.length > 0 ? (
                        <Picker
                          selectedValue={selectedCategory}
                          onValueChange={(itemValue) => {
                            setSelectedCategory(itemValue);
                            if (itemValue) fetchProductsByCategory(itemValue);
                          }}
                          style={styles.picker}
                        >
                          <Picker.Item label="Select a category" value={null} />
                          {productCategories.map((cat) => (
                            <Picker.Item
                              // key={order.orderId}
                              key={cat._id}
                              label={cat.name}
                              value={cat._id}
                            />
                          ))}
                        </Picker>
                      ) : (
                        <Text>Loading categories...</Text>
                      )}
                      <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => {
                          if (!selectedCategory) {
                            Alert.alert("Error", "Please select a category.");
                          } else {
                            setStep("productDetails"); // Changed: Move to product selection
                          }
                        }}
                      >
                        <Text style={styles.submitButtonText}>Next</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              ) : step === "productDetails" ? (
                // Changed: New step for product selection
                <View>
                  <Text style={styles.modalLabel}>Select Product</Text>
                  {products.length > 0 ? (
                    <Picker
                      selectedValue={relatedId}
                      onValueChange={(itemValue) => setRelatedId(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select a product" value={null} />
                      {products.map((prod) => (
                        <Picker.Item
                          key={prod._id}
                          label={prod.name}
                          value={prod._id}
                        />
                      ))}
                    </Picker>
                  ) : (
                    <Text>Loading products...</Text>
                  )}
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      setSelectedCategory(null);
                      setProducts([]);
                      setRelatedId(null);
                      setStep("details");
                      // Changed: Back to category selection
                    }}
                  >
                    <Text style={styles.submitButtonText}>
                      Back to Categories
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => {
                      if (!relatedId) {
                        Alert.alert("Error", "Please select a product.");
                      } else {
                        setStep("complaintDetails");
                      }
                    }}
                  >
                    <Text style={styles.submitButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
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
                  <TouchableOpacity
                    style={styles.imagePickerButton}
                    onPress={pickImages}
                  >
                    <Ionicons name="image-outline" size={20} color="#007AFF" />
                    <Text style={styles.imagePickerText}>
                      Add Images (Max 3)
                    </Text>
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
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitComplaint}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complaint Details</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={[styles.modalBody,{marginBottom:10}]}>
              {selectedComplaint && (
                <>
                  {/* <Text style={styles.modalDetail}>
                    ID: {selectedComplaint._id}
                  </Text> */}
                  <Text style={styles.modalDetail}>
                    Title: {selectedComplaint.title}
                  </Text>
                  <Text style={styles.modalDetail}>
                    Date: {selectedComplaint.date}
                  </Text>
                  <Text style={styles.modalDetail}>
                    Status: {selectedComplaint.status}
                  </Text>
                  <Text style={styles.modalDetail}>
                    Type:{" "}
                    {selectedComplaint.complaintType
                      ? selectedComplaint.complaintType
                          .charAt(0)
                          .toUpperCase() +
                        selectedComplaint.complaintType.slice(1)
                      : "Other"}
                  </Text>
                  <Text style={styles.modalDetail}>
                    Related ID: {selectedComplaint.relatedId || "N/A"}
                  </Text>
                  <Text style={styles.modalLabel}>Message:</Text>
                  <Text style={styles.modalText}>
                    {selectedComplaint.message}
                  </Text>
                  {selectedComplaint &&
                    selectedComplaint.images &&
                    selectedComplaint.images.length > 0 && (
                      <>
                        <Text style={styles.modalLabel}>Images:</Text>
                        <View style={styles.imageSliderContainer}>
                          <FlatList
                            data={selectedComplaint.images}
                            renderItem={({ item }) => (
                              <Image
                                source={{ uri: item }}
                                style={styles.sliderImage}
                              />
                            )}
                            keyExtractor={(item, index) => `${item}-${index}`}
                            horizontal
                            pagingEnabled // Enables slider behavior
                            showsHorizontalScrollIndicator={false} // Hides scroll bar
                            style={styles.imageSlider}
                          />
                          {selectedComplaint.images.length > 1 && (
                            <View style={styles.pagination}>
                              {selectedComplaint.images.map((_, index) => (
                                <View
                                  key={index}
                                  style={[
                                    styles.paginationDot,
                                    {
                                      opacity:
                                        index === Math.floor(scrollX / width)
                                          ? 1
                                          : 0.3,
                                    }, // Basic active dot (requires scroll tracking)
                                  ]}
                                />
                              ))}
                            </View>
                          )}
                        </View>
                      </>
                    )}
                  {selectedComplaint.wholesalerResponse && (
                    <>
                      <Text style={styles.modalLabel}>
                        Wholesaler Response:
                      </Text>
                      <Text style={styles.modalText}>
                        {selectedComplaint.wholesalerResponse}
                      </Text>
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
