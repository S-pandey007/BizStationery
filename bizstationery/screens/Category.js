// Category.js
import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import styles from '../style/Categorystyles';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import {fetchCategories} from '../api/apiService';
import {useSelector , useDispatch} from 'react-redux'

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
    // fetch categories data
        const dispatch = useDispatch()
        const categoryData = useSelector((state)=> state.categories)
    const categoryList = categoryData.categoryList 
        useEffect(() => {
          dispatch(fetchCategories())
        },[dispatch])
      
        useEffect(()=>{
          console.log('category list:',categoryList.category);
          // console.log(categoryList.category[0].image_link)
          // console.log(categoryList.category[0].category)
        },[categoryList])

 
  const renderItem = ({ item }) => (
    <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('CategoryDetail', { category: item._id })}>
      <Image source={{ uri:item.images}} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
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
        data={categoryList}
        // keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
      />
    </View>
  );
};

export default CategoryScreen;
