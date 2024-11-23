import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  symbol: "$",
};

const currencySymbolSlice = createSlice({
  name: "currencySymbol",
  initialState,
  reducers: {
    setCurrencySymbol: (state, action) => {
      state.symbol = action.payload;
    },
    resetCurrencySymbol: (state) => {
      state.symbol = "$";
    },
  },
});

export const { setCurrencySymbol, resetCurrencySymbol } =
  currencySymbolSlice.actions;
export const selectCurrencySymbol = (state) => state.currencySymbol.symbol;
export default currencySymbolSlice.reducer;
