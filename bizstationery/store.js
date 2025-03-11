import { configureStore,combineReducers } from '@reduxjs/toolkit';
import {persistStore,persistReducer} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

import categoryReducer from './redux/slice/categorySlice'
import cartReducer from './redux/slice/cartSlice'
import savedItemReducer from './redux/slice/savedItemsSlice'

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  categories: categoryReducer,
  cart: cartReducer,
  savedItems: savedItemReducer,
});

// configuration for redux-persist
const persistConfig = {
  key:'root',  // key to store data in AsyncStorage
  storage: AsyncStorage, 
  whitelist: ['cart','savedItems'],// only persist the 'cart' slice
}


// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);


// Create the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Debug: Check AsyncStorage after store is created
const checkPersistedData = async () => {
  try {
    const data = await AsyncStorage.getItem('persist:root');
    console.log('Persisted data in AsyncStorage:', data ? JSON.parse(data) : null);
  } catch (error) {
    console.log('Error reading AsyncStorage:', error);
  }
};
checkPersistedData();

export const persistor = persistStore(store, null, () => {
  console.log('PersistGate loaded state:', store.getState()); // Log state after rehydration
});

// export const persistor = persistStore(store)
export default store;