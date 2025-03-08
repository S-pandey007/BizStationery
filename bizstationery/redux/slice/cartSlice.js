import {createSlice} from '@reduxjs/toolkit'

const initialState ={
    items:[],
}

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        // add item to cart
        addToCart: (state,action)=>{
            const {id,quantity, ...product}= action.payload;
            const existingItem = state.items.find((item)=> item.id === id)
            
            if(existingItem){
                existingItem.quantity += quantity
            }else{
                state.items.push({id,quantity, ...product})
            }
            console.log('Cart state after addToCart:', state.items);
        },

        // update item quantity
        updateQuantity :(state,action)=>{
            const {id, quantity} = action.payload
            const item = state.items.find((item)=> item.id === id)
            if(item){
                item.quantity = Math.max(1,quantity)
            }
        },

        // Remove item from cart
        removeFromCart :(state,action)=>{
            state.items = state.items.filter((item)=> item.id !== action.payload)
        },

        //clear cart 
        clearCart :(state,action)=>{
            state.items = []
        }
    }
})

export const {addToCart,updateQuantity,removeFromCart,clearCart} = cartSlice.actions

export default cartSlice.reducer;