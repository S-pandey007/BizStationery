import {createSlice} from '@reduxjs/toolkit'

const savedItemsSlice = createSlice({
    name: 'savedItems',
    initialState: {
        items: [],
    },

    reducers:{
        addToSavedItems: (state, action) => {
            const item = action.payload;
            if (!state.items.some((i) => i.id === item.id)) {
              state.items.push(item);
            }
          },
          removeFromSaveItems: (state, action) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
          },
    }
})


export const {addToSavedItems, removeFromSaveItems} = savedItemsSlice.actions;
export default savedItemsSlice.reducer;