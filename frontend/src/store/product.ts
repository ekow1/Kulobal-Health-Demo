import { create } from "zustand"
import type { Product } from "@/lib/products"
import { products } from "@/lib/products"

interface MarketplaceState {
  products: Product[]
  cart: Record<string, number>
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  products,
  cart: {},
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
}))
