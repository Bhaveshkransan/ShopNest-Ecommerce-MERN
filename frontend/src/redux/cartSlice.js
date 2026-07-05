import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1;

      const existItem = state.cartItems.find(
        x => x._id === item._id
      );

      if (existItem) {
        if (item.quantity === undefined) {
          existItem.quantity += 1;
        } else {
          existItem.quantity = quantity;
        }
      } else {
        state.cartItems.push({
          ...item,
          quantity,
        });
      }

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        item => item._id !== action.payload
      )

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      )
    },

    clearCart: (state) => {
      state.cartItems = [];

      localStorage.setItem(
        'cartItems',
        JSON.stringify(state.cartItems)
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;