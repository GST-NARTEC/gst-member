import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./apis/apiSlice";
import currencySymbolReducer from "./slices/currencySymbolSlice";
import cartReducer from "./slices/cartSlice";
import memberReducer from "./slices/memberSlice";
import personalInfoReducer from "./slices/personalInfoSlice";

// Load state from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined;
    }
    const persistedState = JSON.parse(serializedState);
    return {
      currencySymbol: persistedState.currencySymbol,
      cart: persistedState.cart,
      member: persistedState.member,
      personalInfo: persistedState.personalInfo,
    };
  } catch (err) {
    return undefined;
  }
};

// Save state to local storage
const saveState = (state) => {
  try {
    const stateToPersist = {
      currencySymbol: state.currencySymbol,
      cart: state.cart,
      member: state.member,
      personalInfo: state.personalInfo,
    };
    const serializedState = JSON.stringify(stateToPersist);
    localStorage.setItem("reduxState", serializedState);
  } catch (err) {
    // Handle errors here
  }
};

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    currencySymbol: currencySymbolReducer,
    cart: cartReducer,
    member: memberReducer,
    personalInfo: personalInfoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

setupListeners(store.dispatch);
