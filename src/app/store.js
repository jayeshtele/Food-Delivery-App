import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import ordersReducer from "../features/orders/ordersSlice";
import restaurantsReducer from "../features/restaurants/restaurantSlice";
import { loadState, saveState } from "./localStorage";

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: ordersReducer,
    restaurants: restaurantsReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveState({
    cart: state.cart,
    orders: state.orders,
  });
});
