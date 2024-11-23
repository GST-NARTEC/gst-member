import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./apis/apiSlice";
import currencySymbolReducer from "./slices/currencySymbolSlice";
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
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  preloadedState: loadState(),
});
// Save state to local storage whenever the state changes
store.subscribe(() => {
  saveState(store.getState());
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
