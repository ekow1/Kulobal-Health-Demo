import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { apiClient } from "@/lib/api-client"
import type { Payment } from "@/types/payment"

interface PaymentStats {
  total: number
  completed: number
  pending: number
  failed: number
  totalAmount: number
  cardPayments: number
  mobileMoneyPayments: number
  byNetwork: Record<string, number>
  byCardType: Record<string, number>
}

interface PaymentState {
  // Payment data
  payments: Payment[]
  filteredPayments: Payment[]
  selectedPayment: Payment | null
  stats: PaymentStats | null

  // UI state
  isLoading: boolean
  error: string | null
  filterType: "all" | "card" | "mobile_money" | "cash on delivery" | "credit" | null
  filterStatus: Payment["status"] | null
  filterUserId: string | null

  // Actions
  fetchPayments: () => Promise<void>
  fetchPaymentsByUser: (userId: string) => Promise<void>
  fetchPaymentByTransactionId: (transactionId: string) => Promise<void>
  fetchPaymentsByStatus: (status: Payment["status"]) => Promise<void>
  fetchPaymentsByType: (paymentType: "card" | "mobile_money" | "cash on delivery" | "credit") => Promise<void>
  fetchPaymentStats: () => Promise<void>

  createNewPayment: (paymentData: {
    userId: string
    amount: number
    description: string
    paymentType: "card" | "mobile_money" | "cash on delivery" | "credit"
    metadata?: Record<string, string | number | boolean | undefined>
  }) => Promise<Payment>

  simulateNewPayment: (
    userId: string,
    amount: number,
    description: string, 
    paymentType: "card" | "mobile_money" | "cash on delivery" | "credit",
    metadata?: Record<string, unknown>,
  ) => Promise<Payment>

  updateStatus: (id: string, status: Payment["status"], metadata?: Record<string, unknown>) => Promise<void>

  // Filters
  setFilterType: (type: "all" | "card" | "mobile_money" | "cash on delivery" | "credit") => void
  setFilterStatus: (status: Payment["status"] | null) => void
  setFilterUserId: (userId: string | null) => void
  clearFilters: () => void

  // Selection
  selectPayment: (payment: Payment | null) => void
}

export const usePaymentStore = create<PaymentState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        payments: [],
        filteredPayments: [],
        selectedPayment: null,
        stats: null,
        isLoading: false,
        error: null,
        filterType: null,
        filterStatus: null as Payment["status"] | null,
        filterUserId: null,

        // Fetch actions
        fetchPayments: async () => {
          set({ isLoading: true, error: null })
          try {
            const response = await apiClient.getMyPayments()
            if (!response.success) {
              throw new Error(response.message || "Failed to fetch payments")
            }
            
            const payments = response.data?.payments.map(apiPayment => ({
              id: apiPayment._id,
              userId: apiPayment.userId,
              transactionId: apiPayment.transactionId,
              amount: apiPayment.amount,
              currency: apiPayment.currency,
              paymentType: apiPayment.paymentType,
              paymentMethod: apiPayment.paymentMethod,
              status: apiPayment.status,
              description: apiPayment.description,
              createdAt: apiPayment.createdAt,
              updatedAt: apiPayment.updatedAt,
              metadata: apiPayment.metadata,
            })) || []
            
            set({
              payments,
              filteredPayments: payments,
              isLoading: false,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch payments",
              isLoading: false,
            })
          }
        },

        fetchPaymentsByUser: async (userId: string) => {
          set({ isLoading: true, error: null, filterUserId: userId })
          try {
            const response = await apiClient.getMyPayments()
            if (!response.success) {
              throw new Error(response.message || "Failed to fetch user payments")
            }
            
            const payments = response.data?.payments
              .filter(apiPayment => apiPayment.userId === userId)
              .map(apiPayment => ({
                id: apiPayment._id,
                userId: apiPayment.userId,
                transactionId: apiPayment.transactionId,
                amount: apiPayment.amount,
                currency: apiPayment.currency,
                paymentType: apiPayment.paymentType,
                paymentMethod: apiPayment.paymentMethod,
                status: apiPayment.status,
                description: apiPayment.description,
                createdAt: apiPayment.createdAt,
                updatedAt: apiPayment.updatedAt,
                metadata: apiPayment.metadata,
              })) || []
            
            set({
              filteredPayments: payments,
              isLoading: false,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch user payments",
              isLoading: false,
            })
          }
        },

        fetchPaymentByTransactionId: async (transactionId: string) => {
          set({ isLoading: true, error: null })
          try {
            const response = await apiClient.getMyPayments()
            if (!response.success) {
              throw new Error(response.message || "Failed to fetch payment")
            }
            
            const apiPayment = response.data?.payments.find(p => p.transactionId === transactionId)
            if (!apiPayment) {
              set({
                error: `Payment with transaction ID ${transactionId} not found`,
                isLoading: false,
              })
              return
            }
            
            const payment = {
              id: apiPayment._id,
              userId: apiPayment.userId,
              transactionId: apiPayment.transactionId,
              amount: apiPayment.amount,
              currency: apiPayment.currency,
              paymentType: apiPayment.paymentType,
              paymentMethod: apiPayment.paymentMethod,
              status: apiPayment.status,
              description: apiPayment.description,
              createdAt: apiPayment.createdAt,
              updatedAt: apiPayment.updatedAt,
              metadata: apiPayment.metadata,
            }
            
            set({
              selectedPayment: payment,
              isLoading: false,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch payment",
              isLoading: false,
            })
          }
        },

        fetchPaymentsByStatus: async (status: Payment["status"]) => {
          set({ isLoading: true, error: null, filterStatus: status })
          try {
            const response = await apiClient.getMyPayments()
            if (!response.success) {
              throw new Error(response.message || "Failed to fetch payments by status")
            }
            
            const payments = response.data?.payments
              .filter(apiPayment => apiPayment.status === status)
              .map(apiPayment => ({
                id: apiPayment._id,
                userId: apiPayment.userId,
                transactionId: apiPayment.transactionId,
                amount: apiPayment.amount,
                currency: apiPayment.currency,
                paymentType: apiPayment.paymentType,
                paymentMethod: apiPayment.paymentMethod,
                status: apiPayment.status,
                description: apiPayment.description,
                createdAt: apiPayment.createdAt,
                updatedAt: apiPayment.updatedAt,
                metadata: apiPayment.metadata,
              })) || []
            
            set({
              filteredPayments: payments,
              isLoading: false,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch payments by status",
              isLoading: false,
            })
          }
        },

        fetchPaymentsByType: async (paymentType: "card" | "mobile_money" | "cash on delivery" | "credit") => {
          set({ isLoading: true, error: null, filterType: paymentType })
          try {
            const response = await apiClient.getMyPayments()
            if (!response.success) {
              throw new Error(response.message || "Failed to fetch payments by type")
            }
            
            const payments = response.data?.payments
              .filter(apiPayment => apiPayment.paymentType === paymentType)
              .map(apiPayment => ({
                id: apiPayment._id,
                userId: apiPayment.userId,
                transactionId: apiPayment.transactionId,
                amount: apiPayment.amount,
                currency: apiPayment.currency,
                paymentType: apiPayment.paymentType,
                paymentMethod: apiPayment.paymentMethod,
                status: apiPayment.status,
                description: apiPayment.description,
                createdAt: apiPayment.createdAt,
                updatedAt: apiPayment.updatedAt,
                metadata: apiPayment.metadata,
              })) || []
            
            set({
              filteredPayments: payments,
              isLoading: false,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch payments by type",
              isLoading: false,
            })
          }
        },

        fetchPaymentStats: async () => {
          set({ isLoading: true, error: null })
          try {
            const response = await apiClient.getMyPayments()
            if (!response.success) {
              throw new Error(response.message || "Failed to fetch payment statistics")
            }
            
            const payments = response.data?.payments || []
            
            const stats = {
              total: payments.length,
              completed: payments.filter(p => p.status === "completed").length,
              pending: payments.filter(p => p.status === "pending").length,
              failed: payments.filter(p => p.status === "failed").length,
              totalAmount: payments
                .filter(p => p.status === "completed")
                .reduce((sum, p) => sum + p.amount, 0),
              cardPayments: payments.filter(p => p.paymentType === "card").length,
              mobileMoneyPayments: payments.filter(p => p.paymentType === "mobile_money").length,
              byNetwork: {} as Record<string, number>,
              byCardType: {} as Record<string, number>,
            }
            
            // Calculate network stats
            payments.forEach(payment => {
              if (payment.paymentMethod.type === "mobile_money" && payment.paymentMethod.network) {
                stats.byNetwork[payment.paymentMethod.network] = (stats.byNetwork[payment.paymentMethod.network] || 0) + 1
              }
            })
            
            set({
              stats,
              isLoading: false,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch payment statistics",
              isLoading: false,
            })
          }
        },

        // Create and update actions
        createNewPayment: async (paymentData) => {
          set({ isLoading: true, error: null })
          try {
            // Create payment data for API
            const apiPaymentData = {
              amount: paymentData.amount,
              currency: "GHS",
              paymentType: paymentData.paymentType,
              paymentMethod: {
                type: paymentData.paymentType === "card" ? "card" : 
                      paymentData.paymentType === "mobile_money" ? "mobile_money" : "cash",
              } as any,
              description: paymentData.description,
              metadata: {
                orderId: `ORD_${Date.now()}`,
                paymentType: "full-payment",
                paymentMethod: paymentData.paymentType === "card" ? "online-payment" : 
                              paymentData.paymentType === "mobile_money" ? "mobile-money" : "pay-on-delivery",
                pharmacyName: "Kulobal Health",
                shippingDetails: {
                  pharmacyName: "Kulobal Health",
                  phoneNumber: "+233 24 123 4567",
                  pharmacyEmail: "info@kulobalhealth.com",
                  pharmacyLocation: "Accra, Ghana",
                },
                items: [],
                itemsSummary: paymentData.description,
                ...paymentData.metadata,
              },
            }

            const response = await apiClient.createPayment(apiPaymentData as any)
            
            if (!response.success || !response.data?.payment) {
              throw new Error(response.message || "Failed to create payment")
            }

            const apiPayment = response.data.payment
            const newPayment = {
              id: apiPayment._id,
              userId: apiPayment.userId,
              transactionId: apiPayment.transactionId,
              amount: apiPayment.amount,
              currency: apiPayment.currency,
              paymentType: apiPayment.paymentType,
              paymentMethod: apiPayment.paymentMethod,
              status: apiPayment.status,
              description: apiPayment.description,
              createdAt: apiPayment.createdAt,
              updatedAt: apiPayment.updatedAt,
              metadata: apiPayment.metadata,
            }

            set((state) => ({
              payments: [...state.payments, newPayment],
              filteredPayments: [...state.filteredPayments, newPayment],
              isLoading: false,
            }))

            return newPayment
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to create payment",
              isLoading: false,
            })
            throw error
          }
        },

        simulateNewPayment: async (userId, amount, description, paymentType, metadata) => {
          set({ isLoading: true, error: null })
          try {
            // Create payment data for API
            const paymentData = {
              amount,
              currency: "GHS",
              paymentType,
              paymentMethod: {
                type: paymentType === "card" ? "card" : 
                      paymentType === "mobile_money" ? "mobile_money" : "cash",
                // Add card details if available in metadata
                ...(metadata?.cardType ? { cardType: metadata.cardType as any } : {}),
                ...(metadata?.last4Digits ? { last4Digits: metadata.last4Digits as any } : {}),
                ...(metadata?.cardholderName ? { cardholderName: metadata.cardholderName as any } : {}),
                // Add mobile money details if available in metadata
                ...(metadata?.network ? { network: metadata.network as any } : {}),
                ...(metadata?.phoneNumber ? { phoneNumber: metadata.phoneNumber as any } : {}),
                ...(metadata?.accountName ? { accountName: metadata.accountName as any } : {}),
                ...(metadata?.networkDisplayName ? { networkDisplayName: metadata.networkDisplayName as any } : {}),
              },
              description,
              metadata: {
                orderId: metadata?.orderId || `ORD_${Date.now()}`,
                paymentType: metadata?.paymentType || "full-payment",
                paymentMethod: metadata?.paymentMethod || "online-payment",
                pharmacyName: metadata?.pharmacyName || "Kulobal Health",
                shippingDetails: metadata?.shippingDetails || {
                  pharmacyName: "Kulobal Health",
                  phoneNumber: "+233 24 123 4567",
                  pharmacyEmail: "info@kulobalhealth.com",
                  pharmacyLocation: "Accra, Ghana",
                },
                items: metadata?.items || [],
                itemsSummary: description,
                ...metadata,
              },
            }

            const response = await apiClient.createPayment(paymentData as any)
            
            if (!response.success || !response.data?.payment) {
              throw new Error(response.message || "Failed to create payment")
            }

            const apiPayment = response.data.payment
            const payment = {
              id: apiPayment._id,
              userId: apiPayment.userId,
              transactionId: apiPayment.transactionId,
              amount: apiPayment.amount,
              currency: apiPayment.currency,
              paymentType: apiPayment.paymentType,
              paymentMethod: apiPayment.paymentMethod,
              status: apiPayment.status,
              description: apiPayment.description,
              createdAt: apiPayment.createdAt,
              updatedAt: apiPayment.updatedAt,
              metadata: apiPayment.metadata,
            }

            set((state) => ({
              payments: [...state.payments, payment],
              filteredPayments: [...state.filteredPayments, payment],
              isLoading: false,
            }))

            return payment
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to simulate payment",
              isLoading: false,
            })
            throw error
          }
        },

        updateStatus: async (id, status, metadata) => {
          set({ isLoading: true, error: null })
          try {
            // Note: This would need to be implemented in the API
            // For now, we'll just update the local state
            console.warn("updateStatus not fully implemented in API yet")
            
            set((state) => ({
              payments: state.payments.map((p) => (p.id === id ? { ...p, status, metadata: metadata as any } : p)),
              filteredPayments: state.filteredPayments.map((p) => (p.id === id ? { ...p, status, metadata: metadata as any } : p)),
              selectedPayment: state.selectedPayment?.id === id ? { ...state.selectedPayment, status, metadata: metadata as any } : state.selectedPayment,
              isLoading: false,
            }))
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to update payment status",
              isLoading: false,
            })
          }
        },

        // Filter actions
        setFilterType: (type) => {
          set({ filterType: type })
          const { payments, filterStatus, filterUserId } = get()

          let filtered = [...payments]

          if (type && type !== "all") {
            filtered = filtered.filter((p) => p.paymentType === type)
          }

          if (filterStatus) {
            filtered = filtered.filter((p) => p.status === filterStatus)
          }

          if (filterUserId) {
            filtered = filtered.filter((p) => p.userId === filterUserId)
          }

          set({ filteredPayments: filtered })
        },

        setFilterStatus: (status) => {
          set({ filterStatus: status })
          const { payments, filterType, filterUserId } = get()

          let filtered = [...payments]

          if (status) {
            filtered = filtered.filter((p) => p.status === status)
          }

          if (filterType && filterType !== "all") {
            filtered = filtered.filter((p) => p.paymentType === filterType)
          }

          if (filterUserId) {
            filtered = filtered.filter((p) => p.userId === filterUserId)
          }

          set({ filteredPayments: filtered })
        },

        setFilterUserId: (userId) => {
          set({ filterUserId: userId })
          const { payments, filterType, filterStatus } = get()

          let filtered = [...payments]

          if (userId) {
            filtered = filtered.filter((p) => p.userId === userId)
          }

          if (filterType && filterType !== "all") {
            filtered = filtered.filter((p) => p.paymentType === filterType)
          }

          if (filterStatus) {
            filtered = filtered.filter((p) => p.status === filterStatus)
          }

          set({ filteredPayments: filtered })
        },

        clearFilters: () => {
          const { payments } = get()
          set({
            filterType: null,
            filterStatus: null,
            filterUserId: null,
            filteredPayments: payments,
          })
        },

        // Selection action
        selectPayment: (payment) => {
          set({ selectedPayment: payment })
        },
      }),
      {
        name: "payment-store",
        partialize: (state) => ({
          filterType: state.filterType,
          filterStatus: state.filterStatus,
          filterUserId: state.filterUserId,
        }),
      },
    ),
    { name: "PaymentStore" },
  ),
)

// Selector hooks for common use cases
export const usePayments = () => usePaymentStore((state) => state.payments)
export const useFilteredPayments = () => usePaymentStore((state) => state.filteredPayments)
export const useSelectedPayment = () => usePaymentStore((state) => state.selectedPayment)
export const usePaymentStats = () => usePaymentStore((state) => state.stats)
export const usePaymentLoading = () => usePaymentStore((state) => state.isLoading)
export const usePaymentError = () => usePaymentStore((state) => state.error)