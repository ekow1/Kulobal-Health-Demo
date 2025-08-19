import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/lib/products"
import { products as mockProducts } from "@/lib/products"

interface MarketplaceState {
  products: Product[]
  cart: Record<string, number>
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchProducts: (params?: { page?: number; limit?: number; category?: string; search?: string }) => Promise<void>
  fetchProductById: (productId: string) => Promise<Product | null>
  
  // Cart actions
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  clearCart: () => void
  
  // Utility
  clearError: () => void
}

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      products: mockProducts, // Use mock products by default
      cart: {},
      isLoading: false,
      error: null,

      fetchProducts: async (params) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500))
          
          let filteredProducts = [...mockProducts]
          
          // Apply filters
          if (params?.category) {
            filteredProducts = filteredProducts.filter(product => 
              product.category?.toLowerCase().includes(params.category!.toLowerCase())
            )
          }
          
          if (params?.search) {
            filteredProducts = filteredProducts.filter(product => 
              product.name.toLowerCase().includes(params.search!.toLowerCase()) ||
              product.description?.toLowerCase().includes(params.search!.toLowerCase())
            )
          }
          
          // Apply pagination
          if (params?.page && params?.limit) {
            const startIndex = (params.page - 1) * params.limit
            const endIndex = startIndex + params.limit
            filteredProducts = filteredProducts.slice(startIndex, endIndex)
          }
          
          set({ products: filteredProducts, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.message || "Failed to fetch products"
          set({ error: errorMessage, isLoading: false })
          // Fallback to all mock products on error
          set({ products: mockProducts })
        }
      },

      fetchProductById: async (productId: string) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300))
          
          const product = mockProducts.find(p => p.id === productId)
          if (product) {
            set({ isLoading: false })
            return product
          }
          
          set({ isLoading: false })
          return null
        } catch (error: any) {
          const errorMessage = error.message || "Failed to fetch product"
          set({ error: errorMessage, isLoading: false })
          return null
        }
      },

      addToCart: (productId) =>
        set((state) => {
          const product = state.products.find((p) => p.id === productId)
          if (!product) return state
          if (product.stockQuantity === 0) return state

          return {
            cart: {
              ...state.cart,
              [productId]: (state.cart[productId] || 0) + 1,
            },
          }
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const newCart = { ...state.cart }
          delete newCart[productId]
          return { cart: newCart }
        }),

      increaseQuantity: (productId) =>
        set((state) => ({
          cart: {
            ...state.cart,
            [productId]: (state.cart[productId] || 0) + 1,
          },
        })),

      decreaseQuantity: (productId) =>
        set((state) => {
          const currentQuantity = state.cart[productId] || 0
          if (currentQuantity <= 1) {
            const newCart = { ...state.cart }
            delete newCart[productId]
            return { cart: newCart }
          }
          return {
            cart: {
              ...state.cart,
              [productId]: currentQuantity - 1,
            },
          }
        }),

      clearCart: () => {
        set({ cart: {} })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "marketplace-storage",
      partialize: (state) => ({
        products: state.products,
        cart: state.cart,
      }),
    },
  ),
)
