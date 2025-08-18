import type { Product } from "@/lib/products"

export interface CartItem {
  name: any
  price: any
  id: string
  product: Product
  quantity: number
  addedAt: Date
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string) => number
}
