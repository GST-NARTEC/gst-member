import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  personalInfo: {},
  paymentMethod: {
    type: "Bank Transfer", // bank, card, debit, stc, tabby
  },
};

const personalInfoSlice = createSlice({
  name: "personalInfo",
  initialState,

  reducers: {
    setPersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = { ...state.paymentMethod, ...action.payload };
    },
    resetForm: (state) => {
      return initialState;
    },
  },
});

// Export actions
export const { setPersonalInfo, setPaymentMethod, resetForm } =
  personalInfoSlice.actions;

// Selectors
export const selectPersonalInfo = (state) => state.personalInfo.personalInfo;
export const selectPaymentMethod = (state) => state.personalInfo.paymentMethod;

export default personalInfoSlice.reducer;
