import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import categoryReducer from './redux/slice/categorySlice';
import cartReducer from './redux/slice/cartSlice';
import savedItemsReducer from './redux/slice/savedItemsSlice';

const rootReducer = combineReducers({
  categories: categoryReducer,
  cart: cartReducer,
  savedItems: savedItemsReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart', 'savedItems'], // Persist both cart and savedItems
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: ['persist/PERSIST'] },
    }),
});

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
  console.log('PersistGate loaded state:', store.getState());
});

export default store;