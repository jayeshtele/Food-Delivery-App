import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { searchRapidFood } from "../../api/rapidFoodApi";
import { getFallbackLiveItems, restaurants } from "../../data/restaurantData";

export const fetchLiveFood = createAsyncThunk(
  "restaurants/fetchLiveFood",
  async (query = "burger", { rejectWithValue }) => {
    try {
      return await searchRapidFood(query);
    } catch (error) {
      return rejectWithValue({
        items: getFallbackLiveItems(query),
        source: "demo",
        notice: error.message || "RapidAPI unavailable, showing demo menu.",
      });
    }
  },
);

const initialState = {
  restaurants,
  liveItems: getFallbackLiveItems(""),
  liveQuery: "burger",
  liveSource: "demo",
  notice: "Getting live menu from RapidAPI, showing demo menu until then.",
  status: "idle",
};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    setLiveQuery(state, action) {
      state.liveQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveFood.pending, (state, action) => {
        state.status = "loading";
        state.liveQuery = action.meta.arg || "burger";
      })
      .addCase(fetchLiveFood.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liveItems = action.payload.items;
        state.liveSource = action.payload.source;
        state.notice = action.payload.notice;
      })
      .addCase(fetchLiveFood.rejected, (state, action) => {
        state.status = "failed";
        state.liveItems = action.payload?.items || getFallbackLiveItems(state.liveQuery);
        state.liveSource = action.payload?.source || "demo";
        state.notice = action.payload?.notice || "RapidAPI unavailable, showing demo menu.";
      });
  },
});

export const { setLiveQuery } = restaurantSlice.actions;

export const selectRestaurants = (state) => state.restaurants.restaurants;
export const selectLiveItems = (state) => state.restaurants.liveItems;
export const selectLiveStatus = (state) => state.restaurants.status;
export const selectLiveNotice = (state) => state.restaurants.notice;
export const selectLiveSource = (state) => state.restaurants.liveSource;

export const selectRestaurantById = createSelector(
  [selectRestaurants, (_, restaurantId) => restaurantId],
  (items, restaurantId) => items.find((restaurant) => restaurant.id === restaurantId),
);

export default restaurantSlice.reducer;
