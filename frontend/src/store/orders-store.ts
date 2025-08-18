import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentDetails: {
    paymentType: "full-payment" | "partial-payment" | "deposit" | "installment-payment";
    paymentMethod: "pay-on-delivery" | "online-payment" | "mobile-money" | "cash-on-delivery" | "pay-online";
    amount: number;
    status: "pending" | "completed" | "failed";
  };
  shippingDetails: {
    pharmacyName: string;
    phoneNumber: string;
    pharmacyEmail: string;
    pharmacyLocation: string;
    streetAddress: string;
    gpsAddress: string;
  };
  tracking: Array<{
    status: string;
    timestamp: Date;
    description: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface OrdersStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<void>;
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getMyOrders();
      if (response.success && response.data?.orders) {
        set({ orders: response.data.orders, isLoading: false });
      } else {
        set({ error: 'Failed to fetch orders', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getOrder(orderId);
      if (response.success && response.data?.order) {
        set({ isLoading: false });
        return response.data.order;
      } else {
        set({ error: 'Failed to fetch order', isLoading: false });
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  cancelOrder: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.cancelOrder(orderId);
      if (response.success) {
        // Refresh orders after cancellation
        await get().fetchOrders();
      } else {
        set({ error: 'Failed to cancel order', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
