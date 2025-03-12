import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../style/CustomizationRequestsStyle"; // Assuming a separate style file

const CustomizationRequestsScreen = () => {
  const navigation = useNavigation();

  // State for requests, selected request, modals, and filter
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");

  // Initial requests (stored separately for reset)
  const initialRequests = [
    {
      id: "1",
      productName: "Ceiling Fan Winding Machine",
      details: "Change color to black and add speed control.",
      images: [
        { uri: "https://via.placeholder.com/100", fileName: "image1.jpg" },
        { uri: "https://via.placeholder.com/100", fileName: "image2.jpg" },
      ],
      status: "Pending",
      date: "2025-03-01",
    },
    {
      id: "2",
      productName: "Electric Motor",
      details: "Increase power to 500W.",
      images: [],
      status: "Accepted",
      date: "2025-02-28",
    },
    {
      id: "3",
      productName: "LED Bulb Pack",
      details: "Custom packaging with logo.",
      images: [{ uri: "https://via.placeholder.com/100", fileName: "image3.jpg" }],
      status: "Rejected",
      date: "2025-02-25",
    },
  ];

  // Fetch requests (simulated with useEffect)
  useEffect(() => {
    setRequests(initialRequests); // Initial load with simulated data
    // Replace with API call if needed
    // const fetchRequests = async () => {
    //   try {
    //     const response = await fetch('http://192.168.43.3:5000/api/customizations');
    //     const data = await response.json();
    //     setRequests(data);
    //   } catch (error) {
    //     console.error("Error fetching requests:", error);
    //   }
    // };
    // fetchRequests();
  }, []);

  // Apply date filter when dateFilter changes
  useEffect(() => {
    applyFilters();
  }, [dateFilter]);

  const applyFilters = () => {
    let filtered = [...initialRequests]; // Use initialRequests for filtering

    const now = new Date();
    if (dateFilter === "Last 7 Days") {
      filtered = filtered.filter((request) => {
        const requestDate = new Date(request.date);
        const diffDays = (now - requestDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      });
    } else if (dateFilter === "Last 30 Days") {
      filtered = filtered.filter((request) => {
        const requestDate = new Date(request.date);
        const diffDays = (now - requestDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
      });
    }

    setRequests(filtered);
    setFilterModalVisible(false); // Close modal after applying
  };

  // Reset filters to initial state
  const resetFilters = () => {
    setDateFilter("All");
    setRequests([...initialRequests]); // Reset to original data
    setFilterModalVisible(false); // Close modal after resetting
  };

  // Render each request in the list
  const renderRequest = ({ item }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => {
        setSelectedRequest(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.requestId}>Request #{item.id}</Text>
        <Text style={styles.requestDate}>{item.date}</Text>
      </View>
      <Text style={styles.requestProduct}>{item.productName}</Text>
      <Text style={styles.requestDetails} numberOfLines={2}>
        {item.details}
      </Text>
      <View style={styles.statusContainer}>
        <Ionicons
          name={
            item.status === "Pending"
              ? "time-outline"
              : item.status === "Accepted"
              ? "checkmark-circle-outline"
              : "close-circle-outline"
          }
          size={20}
          color={
            item.status === "Pending"
              ? "#FFA726"
              : item.status === "Accepted"
              ? "#4CAF50"
              : "#EF5350"
          }
        />
        <Text style={[styles.requestStatus, { color: item.status === "Pending" ? "#FFA726" : item.status === "Accepted" ? "#4CAF50" : "#EF5350" }]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Empty state
//   if (requests.length === 0) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Customization Requests</Text>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color="#6B48FF" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
//             <Ionicons name="filter" size={24} color="#6B48FF" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.emptyContainer}>
//           <Ionicons name="alert-circle-outline" size={80} color="#A0A0A0" />
//           <Text style={styles.emptyText}>No customization requests available.</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customization Requests</Text>
          
          <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
            <Ionicons name="filter" size={24} color="#6B48FF" />
          </TouchableOpacity>
        </View>
        {/* <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#A0A0A0" />
          <Text style={styles.emptyText}>No customization requests available.</Text>
        </View> */}
     
     {
        requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#A0A0A0" />
          <Text style={styles.emptyText}>No customization requests available.</Text>
        </View>
        ):(
      <FlatList
      data={requests}
      renderItem={renderRequest}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.requestList}
      showsVerticalScrollIndicator={false}
     />
     )
     }
      

      {/* Request Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            {selectedRequest && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalDetail}>Request ID: {selectedRequest.id}</Text>
                <Text style={styles.modalDetail}>Product: {selectedRequest.productName}</Text>
                <Text style={styles.modalDetail}>Date: {selectedRequest.date}</Text>
                <Text style={styles.modalSectionTitle}>Details:</Text>
                <Text style={styles.modalText}>{selectedRequest.details}</Text>

                {/* Image Previews */}
                {selectedRequest.images.length > 0 && (
                  <View style={styles.imageListContainer}>
                    <FlatList
                      data={selectedRequest.images}
                      renderItem={({ item }) => (
                        <Image source={{ uri: item.uri }} style={styles.modalImage} />
                      )}
                      keyExtractor={(item) => item.fileName}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                )}

                <View style={styles.statusContainer}>
                  <Ionicons
                    name={
                      selectedRequest.status === "Pending"
                        ? "time-outline"
                        : selectedRequest.status === "Accepted"
                        ? "checkmark-circle-outline"
                        : "close-circle-outline"
                    }
                    size={24}
                    color={
                      selectedRequest.status === "Pending"
                        ? "#FFA726"
                        : selectedRequest.status === "Accepted"
                        ? "#4CAF50"
                        : "#EF5350"
                    }
                  />
                  <Text style={[styles.modalStatus, { color: selectedRequest.status === "Pending" ? "#FFA726" : selectedRequest.status === "Accepted" ? "#4CAF50" : "#EF5350" }]}>
                    Status: {selectedRequest.status}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Requests</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B48FF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Date</Text>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[styles.filterButton, dateFilter === "All" && styles.filterButtonActive]}
                    onPress={() => setDateFilter("All")}
                  >
                    <Text style={[styles.filterButtonText, dateFilter === "All" && styles.filterButtonTextActive]}>All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, dateFilter === "Last 7 Days" && styles.filterButtonActive]}
                    onPress={() => setDateFilter("Last 7 Days")}
                  >
                    <Text style={[styles.filterButtonText, dateFilter === "Last 7 Days" && styles.filterButtonTextActive]}>Last 7 Days</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, dateFilter === "Last 30 Days" && styles.filterButtonActive]}
                    onPress={() => setDateFilter("Last 30 Days")}
                  >
                    <Text style={[styles.filterButtonText, dateFilter === "Last 30 Days" && styles.filterButtonTextActive]}>Last 30 Days</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterActions}>
                <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};



export default CustomizationRequestsScreen;