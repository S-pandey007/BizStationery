import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      if (!state.cartItems) state.cartItems = [];
      const { id, quantity, ...product } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems?.push({ id, quantity, ...product });
      }
      console.log('Cart state after addToCart:', state.cartItems);
    },

    increaseQuantity: (state, action) => {
      const { id } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item) {
        item.quantity = (item.quantity || 0) + 25;
      }
    },

    decreaseQuantity: (state, action) => {
      const { id } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item && item.quantity > 25) {
        item.quantity -= 25;
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;