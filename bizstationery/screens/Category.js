// Category.js
import React from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import styles from '../style/Categorystyles';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const stationeryItems = [
  { id: '1', title: 'Notebook' },
  { id: '2', title: 'Pen' },
  { id: '3', title: 'Pencil' },
  { id: '4', title: 'Eraser' },
  { id: '5', title: 'Sharpener' },
  { id: '6', title: 'Ruler' },
  { id: '7', title: 'Marker' },
  { id: '8', title: 'Highlighter' },
  { id: '9', title: 'Stapler' },
  { id: '10', title: 'Paper Clips' },
  { id: '11', title: 'Glue Stick' },
  { id: '12', title: 'Scissors' },
  { id: '13', title: 'Calculator' },
  { id: '14', title: 'File Folder' },
  { id: '15', title: 'Sticky Notes' },
  { id: '16', title: 'Whiteboard' },
  { id: '17', title: 'Graph Paper' },
  { id: '18', title: 'Index Cards' },
  { id: '19', title: 'Compass' },
  { id: '20', title: 'Protractor' },
];

const CategoryScreen = () => {
    const navigation = useNavigation(); 

  const handlePress = (item) => {
    alert(`You selected: ${item.title}`);
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.itemContainer} onPress={() => handlePress(item)}>
      <Image source={{ uri: 'https://th.bing.com/th/id/OIP.iyX8lP4wxAZzW7Fa3JWhawHaGD?rs=1&pid=ImgDetMain' }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
       <View style={styles.headerContainer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.header}>Stationery Items</Text>
      </View>
      <FlatList
        data={stationeryItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
      />
    </View>
  );
};

export default CategoryScreen;
