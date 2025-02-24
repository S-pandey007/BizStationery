import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../AuthProvider';

const HomeScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  return (
    <View>
      <Text>Welcome to Home</Text>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
};

export default HomeScreen;
