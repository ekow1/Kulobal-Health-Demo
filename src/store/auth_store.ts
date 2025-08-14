import { useAuthStore, User } from "@/lib/mock-auth/auth"
import { create } from "zustand"
import { persist } from "zustand/middleware"


interface MarketplaceState {
  // Auth state (computed from auth store)
  user: User | null
  isAuthenticated: boolean
}

type MarketplaceActions = object

type MarketplaceStore = MarketplaceState & MarketplaceActions

export const useMarketplaceStore = create<MarketplaceStore>()(
  persist(
    () => ({
      // Auth state (computed from auth store)
      get user() {
        return useAuthStore.getState().user
      },

      get isAuthenticated() {
        return useAuthStore.getState().isAuthenticated
      },
    }),
    {
      name: "marketplace-storage",
      partialize: () => ({}), // No state to persist since we're using computed values
    },
  ),
)
