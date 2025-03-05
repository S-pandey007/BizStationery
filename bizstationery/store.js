import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './redux/slice/categorySlice'
import cartReducer from './redux/slice/cartSlice'
const store = configureStore({
  reducer: {
    categories: categoryReducer, // Must match the slice name
    cart: cartReducer,
  },
});

export default store;