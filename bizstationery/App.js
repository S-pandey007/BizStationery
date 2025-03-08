import Navigation from './navigation.js';
import React, { useContext} from "react";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store from './store.js';
import { persistor } from './store.js';
import { View, Text, ActivityIndicator } from 'react-native';
import { AuthProvider, AuthContext } from './AuthProvider'; // Import AuthContext to use it

export default function App() {
  const { loading: authLoading ,user } = useContext(AuthContext) || {}; // Get loading from AuthProvider
  console.log("App authLoading state:", authLoading, "user:", user);
  
  // Wait for both PersistGate and AuthProvider to finish loading
  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Provider store={store}>
        <PersistGate loading={<Text>Loading persisted state...</Text>} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </AuthProvider>
  );
}