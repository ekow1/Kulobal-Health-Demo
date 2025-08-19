import { create } from "zustand"
import { persist } from "zustand/middleware"
import axios from "axios"

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  _id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentDetails: {
    paymentType: "full-payment" | "partial-payment" | "deposit" | "installment-payment"
    paymentMethod: "pay-on-delivery" | "online-payment" | "mobile-money" | "cash-on-delivery" | "pay-online"
    amount: number
    status: "pending" | "completed" | "failed"
  }
  shippingDetails: {
    pharmacyName: string
    phoneNumber: string
    pharmacyEmail: string
    pharmacyLocation: string
    streetAddress: string
    gpsAddress: string
  }
  tracking: Array<{
    status: string
    timestamp: Date
    description: string
  }>
  createdAt: Date
  updatedAt: Date
}

interface OrdersResponse {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface OrderResponse {
  order: Order
}

interface OrdersStore {
  orders: Order[]
  selectedOrder: Order | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchOrders: (params?: { page?: number; limit?: number; status?: string }) => Promise<void>
  fetchOrderById: (orderId: string) => Promise<Order | null>
  createOrder: (orderData: {
    items: Array<{
      productId: string
      name: string
      quantity: number
      price: number
      category?: string
      image?: string
    }>
    subtotal: number
    deliveryFee: number
    tax: number
    total: number
    currency?: string
    shippingDetails: {
      pharmacyName: string
      phoneNumber: string
      pharmacyEmail: string
      pharmacyLocation: string
      streetAddress?: string
      gpsAddress?: string
    }
    paymentDetails: {
      paymentType: 'full-payment' | 'partial-payment' | 'deposit' | 'credit' | 'installment-payment'
      paymentMethod: 'pay-on-delivery' | 'online-payment' | 'mobile-money' | 'cash-on-delivery' | 'pay-online'
      amount: number
      currency?: string
      transactionId?: string
    }
    notes?: string
    estimatedDelivery?: string
  }) => Promise<Order>
  cancelOrder: (orderId: string, reason?: string) => Promise<void>
  
  // Selection
  selectOrder: (order: Order | null) => void
  clearError: () => void
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      selectedOrder: null,
      isLoading: false,
      error: null,

      fetchOrders: async (params) => {
        set({ isLoading: true, error: null })
        try {
          const queryParams = new URLSearchParams()
          if (params?.page) queryParams.append('page', params.page.toString())
          if (params?.limit) queryParams.append('limit', params.limit.toString())
          if (params?.status) queryParams.append('status', params.status)

          const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/my-orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
          const response = await axios.get(url, { withCredentials: true })
          
          if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch orders")
          }
          
          const orders = response.data.data?.orders || []
          set({ orders, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Failed to fetch orders"
          set({ error: errorMessage, isLoading: false })
        }
      },

      fetchOrderById: async (orderId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${orderId}`, { withCredentials: true })
          
          if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch order")
          }
          
          const order = response.data.data?.order
          if (order) {
            set({ selectedOrder: order, isLoading: false })
            return order
          }
          
          set({ isLoading: false })
          return null
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Failed to fetch order"
          set({ error: errorMessage, isLoading: false })
          return null
        }
      },

      createOrder: async (orderData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders`, orderData, { withCredentials: true })
          
          // Check if response has data and success flag
          if (response.data && response.data.success === false) {
            throw new Error(response.data.message || "Failed to create order")
          }
          
          const order = response.data?.data?.order
          if (order) {
            const currentOrders = get().orders
            set({ 
              orders: [order, ...currentOrders],
              isLoading: false 
            })
            return order
          }
          
          // If we get here, the order was created but response format is unexpected
          console.warn("Order created but response format unexpected:", response.data)
          set({ isLoading: false })
          return { _id: 'temp-id', orderNumber: 'TEMP', ...orderData } // Return a temporary order object
        } catch (error: any) {
          console.error("Order creation error:", error)
          const errorMessage = error.response?.data?.message || error.message || "Failed to create order"
          set({ error: errorMessage, isLoading: false })
          throw new Error(errorMessage)
        }
      },

      cancelOrder: async (orderId: string, reason?: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${orderId}/cancel`, { reason }, { withCredentials: true })
          
          if (!response.data.success) {
            throw new Error(response.data.message || "Failed to cancel order")
          }
          
          const updatedOrder = response.data.data?.order
          if (updatedOrder) {
            const currentOrders = get().orders
            const updatedOrders = currentOrders.map(o => 
              o._id === orderId ? updatedOrder : o
            )
            
            set({ 
              orders: updatedOrders,
              selectedOrder: get().selectedOrder?._id === orderId ? updatedOrder : get().selectedOrder,
              isLoading: false 
            })
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Failed to cancel order"
          set({ error: errorMessage, isLoading: false })
          throw new Error(errorMessage)
        }
      },

      selectOrder: (order) => {
        set({ selectedOrder: order })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "orders-storage",
      partialize: (state) => ({
        orders: state.orders,
        selectedOrder: state.selectedOrder,
      }),
    },
  ),
)
