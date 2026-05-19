import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.items.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        existing.quantity += 1;
        return;
      }

      state.items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurantName: item.restaurantName,
        accent: item.accent,
        quantity: 1,
      });
    },
    incrementItem(state, action) {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementItem(state, action) {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);
      if (!item) {
        return;
      }

      if (item.quantity === 1) {
        state.items = state.items.filter((cartItem) => cartItem.id !== action.payload);
        return;
      }

      item.quantity -= 1;
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, incrementItem, decrementItem, removeItem, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity * item.price, 0),
);

export default cartSlice.reducer;
