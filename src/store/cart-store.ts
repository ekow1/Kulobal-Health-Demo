import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartState, CartItem } from "@/types/cart"
import type { Product } from "@/lib/products"

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id)

          let newItems: CartItem[]

          if (existingItem) {
            // Update quantity if item already exists
            newItems = state.items.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
            )
          } else {
            // Add new item
            const newItem: CartItem = {
              id: product.id,
              name: product.name,
              price: product.price,
              product,
              quantity,
              addedAt: new Date(),
            }
            newItems = [...state.items, newItem]
          }

          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const totalPrice = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

          return {
            items: newItems,
            totalItems,
            totalPrice,
          }
        })
      },

      removeItem: (productId: string) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== productId)
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const totalPrice = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

          return {
            items: newItems,
            totalItems,
            totalPrice,
          }
        })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => {
          const newItems = state.items.map((item) => (item.id === productId ? { ...item, quantity } : item))
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const totalPrice = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

          return {
            items: newItems,
            totalItems,
            totalPrice,
          }
        })
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        })
      },

      getItemQuantity: (productId: string) => {
        const item = get().items.find((item) => item.id === productId)
        return item ? item.quantity : 0
      },
    }),
    {
      name: "cart-storage", // localStorage key
    },
  ),
)
