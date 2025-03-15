import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array of saved items
};

const savedItemsSlice = createSlice({
  name: "savedItems",
  initialState,
  reducers: {
    addToSavedItems: (state, action) => {
      const { id, variant } = action.payload;
      const key = `${id}-${variant?.quality || "default"}`;
      if (!state.items.some((item) => `${item.id}-${item.variant?.quality || "default"}` === key)) {
        state.items.push(action.payload);
      }
    },
    removeFromSavedItems: (state, action) => {
      const { id, variantQuality } = action.payload;
      state.items = state.items.filter(
        (item) => item.id !== id || (variantQuality && item.variant?.quality !== variantQuality)
      );
    },
  },
});

export const { addToSavedItems, removeFromSavedItems } = savedItemsSlice.actions;
export default savedItemsSlice.reducer;