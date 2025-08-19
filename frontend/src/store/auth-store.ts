import { create } from "zustand"
import { persist } from "zustand/middleware"
import axios from "axios"
import { User, RegisterData } from "@/types/user"

interface LoginResponse {
  user: {
    _id: string
    businessName: string
    ownerName: string
    location: string
    email: string
    telephone: string
    avatar?: string
    role: 'pharmacy' | 'supplier' | 'otc' | 'admin'
    isVerified: boolean
    isActive: boolean
    lastLogin?: string
    createdAt: string
    updatedAt: string
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
  clearError: () => void
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  getProfile: () => Promise<{ success: boolean; error?: string }>
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
            email,
            password
          }, { withCredentials: true })

          const { data } = response

          if (!data.success) {
            set({ error: data.message || "Login failed", isLoading: false })
            return { success: false, error: data.message || "Login failed" }
          }

          if (data.data?.user) {
            // Convert API user format to frontend format
            const user: User = {
              id: data.data.user._id,
              businessName: data.data.user.businessName,
              ownerName: data.data.user.ownerName,
              location: data.data.user.location,
              email: data.data.user.email,
              telephone: data.data.user.telephone,
              avatar: data.data.user.avatar,
              role: data.data.user.role,
              createdAt: data.data.user.createdAt,
            }

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return { success: true }
          }

          return { success: false, error: "Login failed. Please try again." }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Login failed. Please try again."
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null })

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, userData, { withCredentials: true })

          const { data } = response

          if (!data.success) {
            set({ error: data.message || "Registration failed", isLoading: false })
            return { success: false, error: data.message || "Registration failed" }
          }

          // Don't set user as authenticated after registration
          // User should login separately after successful registration
          set({
            isLoading: false,
            error: null,
          })
          return { success: true }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again."
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      logout: async () => {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/logout`, {}, { withCredentials: true })
          
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          })
          
          return { success: true }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Logout failed"
          set({ error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      clearError: () => {
        set({ error: null })
      },

      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null })

        const currentUser = get().user
        if (!currentUser) {
          set({ isLoading: false, error: "No user logged in" })
          return { success: false, error: "No user logged in" }
        }

        try {
          const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, userData, { withCredentials: true })

          const { data } = response

          if (!data.success) {
            set({ error: data.message || "Update failed", isLoading: false })
            return { success: false, error: data.message || "Update failed" }
          }

          if (data.data?.user) {
            // Convert API user format to frontend format
            const user: User = {
              id: data.data.user._id,
              businessName: data.data.user.businessName,
              ownerName: data.data.user.ownerName,
              location: data.data.user.location,
              email: data.data.user.email,
              telephone: data.data.user.telephone,
              avatar: data.data.user.avatar,
              role: data.data.user.role,
              createdAt: data.data.user.createdAt,
            }

            set({
              user,
              isLoading: false,
              error: null,
            })
            return { success: true }
          }

          return { success: false, error: "Update failed" }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Profile update failed. Please try again."
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      getProfile: async () => {
        set({ isLoading: true, error: null })

        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, { withCredentials: true })

          const { data } = response

          if (!data.success) {
            set({ error: data.message || "Failed to get profile", isLoading: false })
            return { success: false, error: data.message || "Failed to get profile" }
          }

          if (data.data?.user) {
            // Convert API user format to frontend format
            const user: User = {
              id: data.data.user._id,
              businessName: data.data.user.businessName,
              ownerName: data.data.user.ownerName,
              location: data.data.user.location,
              email: data.data.user.email,
              telephone: data.data.user.telephone,
              avatar: data.data.user.avatar,
              role: data.data.user.role,
              createdAt: data.data.user.createdAt,
            }

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return { success: true }
          }

          return { success: false, error: "Failed to get profile" }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Failed to get profile"
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
