import { create } from "zustand";
import { User } from "./types";
import { apiClient } from "@/lib/api-client";
import axios from "axios";

// Define the store state interface

interface UserStore {
  user: Partial<User>;
  isloading: boolean;
  error: string | null;
  toast: string | null;
  userData: Partial<User>;
  updateUserData: (newData: Partial<User>) => void;
  createUser: () => Promise<void>;
  loginUser: (credentials: { email: string; password: string }) => Promise<void>;
  VerificationEmail: (email: string, code : string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  userInfo: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: {},
  isloading: false,
  error: null,
  toast: null,
  userData: {},

  updateUserData: (newData: Partial<User>) =>
    set((state) => ({
      userData: { ...state.userData, ...newData },
    })),

  createUser: async () => {
    const { userData } = get();
    set({ isloading: true });
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/register`, userData);
      set({ user: response.data, isloading: false });
      console.log(userData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      set({ error: errorMessage, isloading: false });
      console.log(userData);
    }
  },

  loginUser: async (credentials: { email: string; password: string }) => {
    set({ isloading: true });
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/login`,
        {
          email: credentials.email,
          password: credentials.password,
        }
      );
      set({ user: response.data, isloading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
        // Removed logging of sensitive credentials to enhance security.
      set({ error: errorMessage, isloading: false });
    }
  },

  VerificationEmail: async (email: string, code : string) => {
    set({ isloading: true });
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/verify-email`, {
        email: email,
        code: code,
      });
      set({ user: response.data, isloading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      set({ error: errorMessage, isloading: false });
    }
  },



  //forgot password
  forgotPassword: async (email: string) =>{
    set({ isloading: true });
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/forgot-password`, {
        email,
      });
      set({ user: response.data, isloading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      set({ error: errorMessage, isloading: false });
    }
  },

  //resetPassword
  resetPassword: async (token: string, newPassword: string) => {
    set({ isloading: true });
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password`, {
        token,
        newPassword,
      });
      set({ user: response.data, isloading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      set({ error: errorMessage, isloading: false });
    }
  }
,

  //change password
  changePassword: async (oldPassword: string, newPassword: string) => {
    set({ isloading: true });
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/change-password`, {
        oldPassword,
        newPassword,
      });
      set({ user: response.data, isloading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      set({ error: errorMessage, isloading: false });
    }
  },

  userInfo: async () => {
    set({ isloading: true });
    try {
      const response = await apiClient.getProfile();
      console.log("response :",response)
      if (response.success && response.data?.user) {
        set({ userData: response.data.user as unknown as Partial<User>, isloading: false });
      } else {
        set({ error: 'Failed to fetch user data', isloading: false });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      set({ error: errorMessage, isloading: false });
    }
  }
}));

