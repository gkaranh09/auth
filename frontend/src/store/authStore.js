import { create } from "zustand";
import axios from "axios";
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : `${import.meta.env.VITE_BACKEND_URL}/api/auth`;
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error sining up",
        isLoading: false,
      });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verifyemail`, {
        code,
      });
      set({
        // user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch {
      set({
        error: error.response.data.message || "Error in Verifying Email",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      console.log(response);

      set({
        user: response.data.user,
        error: null,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.log(error.response?.data?.message);
      set({
        error: error.response?.data?.message || "Error in Login",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/checkauth`);
      // console.log(response);

      set({
        isCheckingAuth: false,
        isAuthenticated: response.data.success,
        user: response.data.user,
        error: null,
      });
    } catch (error) {
      set({
        isCheckingAuth: false,
        isAuthenticated: false,
        user: null,
        // error: error.response?.data?.message || "Error checking auth",
      });
      throw error;
    }
  },

  forgotpassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/forgotpassword`, { email });

      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      set({ isLoading: false, error: error.response.message });
      throw error;
    }
  },

  resetpassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/resetpassword/${token}`, {
        password,
      });
      set({
        message: response.data.message || "Error resetting password",
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.data.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
