import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  userId: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const token = Cookies.get("accessToken");

const initialState: AuthState = {
  token: null, // stored in local not iin redux
  userId: null,
  role: null,
  isAuthenticated: !!token, //converts token to boolean
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, userId, role } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      state.userId = userId;
      state.role = role;

      if (token) Cookies.set("accessToken", token);
      if (userId) localStorage.setItem("userId", userId);
      if (role) localStorage.setItem("role", role);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userId = null;
      state.role = null;

      Cookies.remove("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
