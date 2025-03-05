import {createSlice} from '@reduxjs/toolkit';

const categorySlice = createSlice({
    name :'categories',
    initialState: {
        categoryList: [],
        loading: false,
        error: null,
    },

    reducers:{
        setCategories:(state,action)=>{
            state.categoryList = action.payload;
            state.loading = false;
        },
        setLoading:(state)=>{
            state.loading = true;
        },
        setError:(state,action)=>{
            state.error = action.payload;
            state.loading = false;
        }
    }
})

export const {setCategories,setLoading,setError} = categorySlice.actions;
export default categorySlice.reducer;