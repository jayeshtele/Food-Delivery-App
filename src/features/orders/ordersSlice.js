import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  activeOrderId: null,
};

const makeOrderId = () => `CR${Date.now().toString(36).toUpperCase().slice(-6)}`;

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeOrder: {
      reducer(state, action) {
        state.orders.unshift(action.payload);
        state.activeOrderId = action.payload.id;
      },
      prepare({ items, customer, totals, payment }) {
        return {
          payload: {
            id: makeOrderId(),
            createdAt: Date.now(),
            etaMinutes: 34,
            items,
            customer,
            totals,
            payment: {
              method: payment.method,
              last4: payment.last4,
              status: "successful",
              transactionId: `PAY-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
            },
          },
        };
      },
    },
  },
});

export const { placeOrder } = ordersSlice.actions;

export const selectOrders = (state) => state.orders.orders;
export const selectActiveOrderId = (state) => state.orders.activeOrderId;
export const selectActiveOrder = (state) =>
  state.orders.orders.find((order) => order.id === state.orders.activeOrderId);
export const selectOrderById = (state, orderId) =>
  state.orders.orders.find((order) => order.id === orderId);

export default ordersSlice.reducer;
