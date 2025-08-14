import { create } from "zustand"
import { persist } from "zustand/middleware"
import { loginUser, registerUser, updateUserProfile,logoutUser } from "@/app/actions/auth-actions"

export interface User {
  id: string
  businessName: string
  ownerName: string
  location: string
  email: string
  telephone: string
  avatar?: string
  role: "pharmacy" | "supplier" | "otc" | "admin"
  createdAt: string
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
  logout: () => void
  clearError: () => void
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
}

interface RegisterData {
  businessName: string
  ownerName: string
  location: string
  email: string
  telephone: string
  password: string
  role: "pharmacy" | "supplier" | "otc" | "admin"
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
          const result = await loginUser(email, password)

          if (!result.success || result.error) {
            set({ error: result.error || "Login failed", isLoading: false })
            return { success: false, error: result.error || "Login failed" }
          }

          if (result.user) {
            set({
              user: result.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return { success: true }
          }

          return { success: false, error: "Unknown error occurred" }
        } catch {
          const errorMessage = "Login failed. Please try again."
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null })

        try {
          const result = await registerUser(userData)

          if (!result.success || result.error) {
            set({ error: result.error || "Registration failed", isLoading: false })
            return { success: false, error: result.error || "Registration failed" }
          }

          // Don't set user as authenticated after registration
          // User should login separately after successful registration
          set({
            isLoading: false,
            error: null,
          })
          return { success: true }
        } catch {
          const errorMessage = "Registration failed. Please try again."
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      logout: async () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })

        const result = await logoutUser()
        if (result) {
           return { success: true }
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
          const result = await updateUserProfile(currentUser.id, userData)

          if (!result.success || result.error) {
            set({ error: result.error || "Update failed", isLoading: false })
            return { success: false, error: result.error || "Update failed" }
          }

          if (result.user) {
            set({
              user: result.user,
              isLoading: false,
              error: null,
            })
            return { success: true }
          }

          return { success: false, error: "Update failed" }
        } catch {
          const errorMessage = "Profile update failed. Please try again."
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
