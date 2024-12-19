import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, updateAccessToken, logout } =
  memberSlice.actions;
export default memberSlice.reducer;

export const selectCurrentUser = (state) => state.member.user;
export const selectCurrentAccessToken = (state) => state.member.accessToken;
export const selectCurrentRefreshToken = (state) => state.member.refreshToken;
export const selectCurrentIsAuthenticated = (state) =>
  state.member.isAuthenticated;
