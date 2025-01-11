import { createSlice } from "@reduxjs/toolkit";
import { calculatePrice } from "../../utils/priceCalculations";

const initialState = {
  items: [],
  subtotal: 0,
  vat: 0,
  total: 0,
  vatDetails: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      if (!Array.isArray(state.items)) {
        state.items = [];
      }

      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
        const { totalPrice, unitPrice } = calculatePrice(existingItem.quantity);
        existingItem.totalPrice = totalPrice;
        existingItem.unitPrice = unitPrice;
      } else {
        const { totalPrice, unitPrice } = calculatePrice(1);
        state.items.push({
          ...action.payload,
          quantity: 1,
          totalPrice,
          unitPrice,
          selectedAddons: [],
        });
      }
    },
    updateQuantity: (state, action) => {
      if (!Array.isArray(state.items)) {
        state.items = [];
        return;
      }

      const { productId, change } = action.payload;
      state.items = state.items
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = (item.quantity || 1) + change;
            if (newQuantity > 0) {
              const { totalPrice, unitPrice } = calculatePrice(newQuantity);
              return {
                ...item,
                quantity: newQuantity,
                totalPrice,
                unitPrice,
              };
            }
            return null;
          }
          return item;
        })
        .filter(Boolean);
    },
    updateCartItemAddons: (state, action) => {
      if (!Array.isArray(state.items)) {
        state.items = [];
        return;
      }

      const { index, selectedAddons } = action.payload;
      if (state.items[index]) {
        state.items[index].selectedAddons = selectedAddons;
      }
    },
    removeFromCart: (state, action) => {
      if (!Array.isArray(state.items)) {
        state.items = [];
        return;
      }
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setCartTotals: (state, action) => {
      if (!Array.isArray(state.items)) {
        state.items = [];
      }

      const { subtotal, vat, total } = action.payload;
      state.subtotal = subtotal || 0;
      state.vat = vat || 0;
      state.total = total || 0;
    },
    setVatDetails: (state, action) => {
      state.vatDetails = action.payload || {};
    },
    clearCart: () => {
      return initialState;
    },
  },
});

export const {
  setCartItems,
  addToCart,
  updateQuantity,
  removeFromCart,
  setCartTotals,
  setVatDetails,
  clearCart,
  updateCartItemAddons,
} = cartSlice.actions;

export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart?.items || [];
export const selectCartTotals = (state) => ({
  subtotal: state.cart?.subtotal || 0,
  vat: state.cart?.vat || 0,
  total: state.cart?.total || 0,
});
export const selectVatDetails = (state) => state.cart?.vatDetails || {};

export default cartSlice.reducer;
