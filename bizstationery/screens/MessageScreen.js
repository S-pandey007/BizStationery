import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import io from 'socket.io-client';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constant from 'expo-constants';

const BASE_URL = Constant.expoConfig.extra.API_URL;
console.log('BASE_URL:', BASE_URL); // http://192.168.131.3:8001/

function MessageScreen({ route }) {
  const [retailerId, setRetailerId] = useState(null);
  const [wholesaler, setWholesaler] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState(null);
  const flatListRef = useRef(null);

  // Fetch retailerId from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          console.log('Fetched userData:', parsedData);
          setRetailerId(parsedData._id);
        } else {
          console.log('No userData found in AsyncStorage');
          Alert.alert('Error', 'Please log in again');
        }
      } catch (error) {
        console.error('Error fetching userData:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    };
    fetchUserData();
  }, []);

  // Fetch wholesaler details
  useEffect(() => {
    const fetchWholesaler = async () => {
      try {
        const response = await axios.get(`${BASE_URL}wholesaler/fetch`);
        console.log('Fetched wholesaler:', response.data);
        setWholesaler(response.data);
      } catch (error) {
        console.error('Error fetching wholesaler:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to load wholesaler details');
      }
    };
    fetchWholesaler();
  }, []); // Run once on mount

  // Initialize Socket.io
  useEffect(() => {
    if (!retailerId) return;

    const socketInstance = io(BASE_URL, {
      query: { userId: retailerId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: false, // Reuse connection
    });
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Socket connected:', retailerId);
    });
    socketInstance.on('connect_error', (error) => {
      console.error('Socket connect error:', error);
    });

    socketInstance.on('receiveMessage', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg._id === message._id)) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
      Alert.alert('Error', error.message || 'Failed to connect');
    });

    return () => {
      socketInstance.disconnect();
      console.log('Socket disconnected:', retailerId);
    };
  }, [retailerId]); // Depend only on retailerId

  // Fetch chat history
  useEffect(() => {
    if (!wholesaler || !retailerId) return;

    const fetchMessages = async () => {
      const chatId = [wholesaler._id, retailerId].sort().join('_');
      try {
        const response = await axios.get(`${BASE_URL}messages/${chatId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        Alert.alert('Error', 'Failed to load messages');
      }
    };
    fetchMessages();
  }, [wholesaler, retailerId]); // Run when wholesaler or retailerId changes

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (messageText.trim() && socket && wholesaler && retailerId) {
      const messageData = {
        senderId: retailerId,
        receiverId: wholesaler._id,
        content: messageText,
      };
      console.log('Sending message:', messageData);
      socket.emit('sendMessage', messageData);
      setMessageText('');
    } else {
      console.log('Cannot send message:', { messageText, socket: !!socket, wholesaler: !!wholesaler, retailerId });
      Alert.alert('Error', 'Cannot send message. Please try again.');
    }
  };

  // Render each message
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderId === retailerId ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.messageTime}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  if (!retailerId || !wholesaler) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: wholesaler.profileImage || 'https://via.placeholder.com/50' }}
          style={styles.headerImage}
        />
        <View style={styles.headerText}>
          <Text style={styles.headerName}>{wholesaler.name}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#6B48FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#6B48FF',
    elevation: 2,
  },
  headerImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: { flex: 1 },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerShop: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 2,
  },
  messageList: {
    padding: 10,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sentMessage: {
    backgroundColor: '#D5CDF6',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  messageInput: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
});

export default MessageScreen;