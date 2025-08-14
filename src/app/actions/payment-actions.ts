"use server"

import { revalidatePath } from "next/cache"
import { apiClient } from "@/lib/api-client"
import type { Payment } from "@/lib/mock-auth/payment"

// Server Actions
export async function getPayments(): Promise<Payment[]> {
  try {
    const response = await apiClient.getMyPayments()
    
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch payments")
    }

    // Convert API payment format to frontend format
    return response.data?.payments.map(apiPayment => ({
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
  } catch (error) {
    console.error("Get payments error:", error)
    throw new Error("Failed to fetch payments")
  }
}

export async function getPaymentsByUserId(userId: string): Promise<Payment[]> {
  try {
    const response = await apiClient.getMyPayments()
    
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch user payments")
    }

    // Filter by userId and convert format
    return response.data?.payments
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
  } catch (error) {
    console.error("Get payments by user error:", error)
    throw new Error("Failed to fetch user payments")
  }
}

export async function getPaymentByTransactionId(transactionId: string): Promise<Payment | null> {
  try {
    const response = await apiClient.getMyPayments()
    
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch payment")
    }

    const apiPayment = response.data?.payments.find(p => p.transactionId === transactionId)
    
    if (!apiPayment) return null

    return {
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
  } catch (error) {
    console.error("Get payment by transaction ID error:", error)
    throw new Error("Failed to fetch payment")
  }
}

export async function getPaymentsByStatus(status: Payment["status"]): Promise<Payment[]> {
  try {
    const response = await apiClient.getMyPayments({ status })
    
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch payments by status")
    }

    return response.data?.payments.map(apiPayment => ({
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
  } catch (error) {
    console.error("Get payments by status error:", error)
    throw new Error("Failed to fetch payments by status")
  }
}

export async function getPaymentsByType(paymentType: "card" | "mobile_money" | "cash on delivery" | "credit"): Promise<Payment[]> {
  try {
    const response = await apiClient.getMyPayments()
    
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch payments by type")
    }

    return response.data?.payments
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
  } catch (error) {
    console.error("Get payments by type error:", error)
    throw new Error("Failed to fetch payments by type")
  }
}

export async function createPayment(paymentData: {
  userId: string
  amount: number
  description: string
  paymentType: "card" | "mobile_money" | "cash on delivery" | "credit"
  metadata?: Record<string, unknown>
}): Promise<Payment> {
  try {
    const response = await apiClient.createPayment({
      amount: paymentData.amount,
      currency: "GHS",
      paymentType: paymentData.paymentType,
      paymentMethod: {
        type: paymentData.paymentType === "card" ? "card" : 
              paymentData.paymentType === "mobile_money" ? "mobile_money" : "cash",
      },
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
    })

    if (!response.success || !response.data?.payment) {
      throw new Error(response.message || "Failed to create payment")
    }

    const apiPayment = response.data.payment

    return {
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
  } catch (error) {
    console.error("Create payment error:", error)
    throw new Error("Failed to create payment")
  }
}

export async function updatePaymentStatus(
  id: string,
  status: Payment["status"],
  metadata?: Record<string, unknown>,
): Promise<Payment | null> {
  try {
    // Note: This would need to be implemented in the API
    // For now, we'll return null as the API doesn't have this endpoint yet
    console.warn("updatePaymentStatus not implemented in API yet")
      return null
  } catch (error) {
    console.error("Update payment status error:", error)
    throw new Error("Failed to update payment status")
  }
}

export async function getPaymentStats(): Promise<{
  total: number
  completed: number
  pending: number
  failed: number
  totalAmount: number
  cardPayments: number
  mobileMoneyPayments: number
  byNetwork: Record<string, number>
  byCardType: Record<string, number>
}> {
  try {
    const response = await apiClient.getMyPayments()
    
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch payment stats")
    }

    const payments = response.data?.payments || []

    const stats = {
      total: payments.length,
      completed: payments.filter(p => p.status === "completed").length,
      pending: payments.filter(p => p.status === "pending").length,
      failed: payments.filter(p => p.status === "failed").length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
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

    return stats
  } catch (error) {
    console.error("Get payment stats error:", error)
    throw new Error("Failed to fetch payment statistics")
  }
}

export async function simulatePayment(
  userId: string,
  amount: number,
  description: string,
  paymentType: "card" | "mobile_money" | "cash on delivery" | "credit",
  metadata?: Record<string, unknown>,
): Promise<Payment> {
  try {
    // Simulate a payment by creating one with the API
    return await createPayment({
      userId,
      amount,
      description,
      paymentType,
      metadata,
    })
  } catch (error) {
    console.error("Simulate payment error:", error)
    throw new Error("Failed to simulate payment")
  }
}
