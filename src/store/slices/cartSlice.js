import { createSlice} from "@reduxjs/toolkit";

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
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    updateQuantity: (state, action) => {
      const { productId, change } = action.payload;
      state.items = state.items
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean);
    },
    updateCartItemAddons: (state, action) => {
      const { index, selectedAddons } = action.payload;
      if (state.items[index]) {
        state.items[index].selectedAddons = selectedAddons;
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setCartTotals: (state, action) => {
      const { subtotal, vat, total } = action.payload;
      state.subtotal = subtotal;
      state.vat = vat;
      state.total = total;
    },
    setVatDetails: (state, action) => {
      state.vatDetails = action.payload;
    },
    clearCart: (state) => {
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
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotals = (state) => ({
  subtotal: state.cart.subtotal,
  vat: state.cart.vat,
  total: state.cart.total,
});
export const selectVatDetails = (state) => state.cart.vatDetails;

export default cartSlice.reducer;
