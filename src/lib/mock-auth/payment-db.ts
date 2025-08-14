import fs from "fs/promises"
import path from "path"
import { type Payment, generateTransactionId, generateCardDetails, generateMobileMoneyDetails } from "@/lib/mock-auth/payment"

const DB_DIR = path.join(process.cwd(), "db")
const PAYMENTS_FILE = path.join(DB_DIR, "payments.json")

// Initialize the payments database
export async function initPaymentsDatabase() {
  try {
    // Ensure the db directory exists
    await fs.mkdir(DB_DIR, { recursive: true })

    // Check if payments.json exists, if not create it with initial data
    try {
      await fs.access(PAYMENTS_FILE)
      console.log("Payments database already exists")
    } catch {
      console.log("Creating new payments database with seed data...")
      // Generate initial seed data (keep the existing seed data)
      const initialPayments: Payment[] = [
        // Card payments
        {
          id: "pay_1",
          userId: "1",
          transactionId: generateTransactionId("card"),
          amount: 250.0,
          currency: "GHS",
          paymentType: "card",
          paymentMethod: {
            type: "card",
            cardType: "visa",
            last4Digits: "4532",
            expiryMonth: "12",
            expiryYear: "2026",
            cardholderName: "John Doe",
            issuerBank: "GCB Bank",
          },
          status: "completed",
          description: "Medicine purchase - Paracetamol 500mg",
          createdAt: "2024-01-15T14:30:00Z",
          updatedAt: "2024-01-15T14:30:15Z",
          metadata: {
            orderId: "ORD_001",
            pharmacyId: "1",
          },
        },
        {
          id: "pay_2",
          userId: "2",
          transactionId: generateTransactionId("card"),
          amount: 1500.0,
          currency: "GHS",
          paymentType: "card",
          paymentMethod: {
            type: "card",
            cardType: "mastercard",
            last4Digits: "8901",
            expiryMonth: "08",
            expiryYear: "2025",
            cardholderName: "Jane Smith",
            issuerBank: "Ecobank",
          },
          status: "completed",
          description: "Bulk medicine order",
          createdAt: "2024-01-14T09:15:00Z",
          updatedAt: "2024-01-14T09:15:22Z",
          metadata: {
            orderId: "ORD_002",
            supplierId: "2",
          },
        },
        // Mobile Money payments
        {
          id: "pay_3",
          userId: "1",
          transactionId: generateTransactionId("mobile_money"),
          amount: 75.5,
          currency: "GHS",
          paymentType: "mobile_money",
          paymentMethod: {
            type: "mobile_money",
            network: "mtn",
            phoneNumber: "+233 24 123 4567",
            accountName: "John Doe",
            networkDisplayName: "MTN Mobile Money",
          },
          status: "completed",
          description: "Prescription refill",
          createdAt: "2024-01-13T16:45:00Z",
          updatedAt: "2024-01-13T16:45:08Z",
          metadata: {
            orderId: "ORD_003",
            pharmacyId: "1",
          },
        },
        {
          id: "pay_4",
          userId: "3",
          transactionId: generateTransactionId("mobile_money"),
          amount: 320.0,
          currency: "GHS",
          paymentType: "mobile_money",
          paymentMethod: {
            type: "mobile_money",
            network: "vodafone",
            phoneNumber: "+233 20 987 6543",
            accountName: "Admin User",
            networkDisplayName: "Vodafone Cash",
          },
          status: "pending",
          description: "Medical supplies payment",
          createdAt: "2024-01-12T11:20:00Z",
          updatedAt: "2024-01-12T11:20:00Z",
          metadata: {
            orderId: "ORD_004",
            supplierId: "2",
          },
        },
        {
          id: "pay_5",
          userId: "2",
          transactionId: generateTransactionId("mobile_money"),
          amount: 89.99,
          currency: "GHS",
          paymentType: "mobile_money",
          paymentMethod: {
            type: "mobile_money",
            network: "airteltigo",
            phoneNumber: "+233 26 555 7890",
            accountName: "Jane Smith",
            networkDisplayName: "AirtelTigo Money",
          },
          status: "failed",
          description: "Emergency medicine order",
          createdAt: "2024-01-11T20:30:00Z",
          updatedAt: "2024-01-11T20:30:45Z",
          metadata: {
            orderId: "ORD_005",
            pharmacyId: "3",
            failureReason: "Insufficient balance",
          },
        },
        {
          id: "pay_6",
          userId: "1",
          transactionId: generateTransactionId("card"),
          amount: 450.75,
          currency: "GHS",
          paymentType: "card",
          paymentMethod: {
            type: "card",
            cardType: "american_express",
            last4Digits: "1234",
            expiryMonth: "03",
            expiryYear: "2027",
            cardholderName: "John Doe",
            issuerBank: "Standard Chartered",
          },
          status: "completed",
          description: "Monthly medication subscription",
          createdAt: "2024-01-10T08:00:00Z",
          updatedAt: "2024-01-10T08:00:18Z",
          metadata: {
            orderId: "ORD_006",
            subscriptionId: "SUB_001",
            pharmacyId: "1",
          },
        },
      ]

      await fs.writeFile(PAYMENTS_FILE, JSON.stringify(initialPayments, null, 2))
      console.log("Payments database initialized successfully")
    }
  } catch (error) {
    console.error("Failed to initialize payments database:", error)
    throw new Error("Database initialization failed")
  }
}

// Get all payments
export async function getPayments(): Promise<Payment[]> {
  try {
    const data = await fs.readFile(PAYMENTS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Failed to read payments:", error)
    return []
  }
}

// Get payments by user ID
export async function getPaymentsByUserId(userId: string): Promise<Payment[]> {
  const payments = await getPayments()
  return payments.filter((payment) => payment.userId === userId)
}

// Get payment by transaction ID
export async function getPaymentByTransactionId(transactionId: string): Promise<Payment | undefined> {
  const payments = await getPayments()
  return payments.find((payment) => payment.transactionId === transactionId)
}

// Get payments by status
export async function getPaymentsByStatus(status: Payment["status"]): Promise<Payment[]> {
  const payments = await getPayments()
  return payments.filter((payment) => payment.status === status)
}

// Get payments by payment type
export async function getPaymentsByType(paymentType: "card" | "mobile_money"): Promise<Payment[]> {
  const payments = await getPayments()
  return payments.filter((payment) => payment.paymentType === paymentType)
}

// Add a new payment
export async function addPayment(payment: Payment): Promise<Payment> {
  const payments = await getPayments()
  payments.push(payment)
  await fs.writeFile(PAYMENTS_FILE, JSON.stringify(payments, null, 2))
  return payment
}

// Update payment status
export async function updatePaymentStatus(
  id: string,
  status: Payment["status"],
  metadata?: Record<string, unknown>,
): Promise<Payment | undefined> {
  const payments = await getPayments()
  const index = payments.findIndex((payment) => payment.id === id)

  if (index !== -1) {
    payments[index] = {
      ...payments[index],
      status,
      updatedAt: new Date().toISOString(),
      ...(metadata && { metadata: { ...payments[index].metadata, ...metadata } }),
    }
    await fs.writeFile(PAYMENTS_FILE, JSON.stringify(payments, null, 2))
    return payments[index]
  }

  return undefined
}

// Simulate a new payment
export async function simulatePayment(
  userId: string,
  amount: number,
  description: string,
  paymentType: "card" | "mobile_money",
  metadata?: Record<string, unknown>,
): Promise<Payment> {
  const payment: Payment = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    userId,
    transactionId: generateTransactionId(paymentType),
    amount,
    currency: "GHS",
    paymentType,
    paymentMethod: paymentType === "card" ? generateCardDetails() : generateMobileMoneyDetails(),
    status: Math.random() > 0.1 ? "completed" : "failed", // 90% success rate
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata,
  }

  return await addPayment(payment)
}

// Get payment statistics
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
  const payments = await getPayments()

  const stats = {
    total: payments.length,
    completed: payments.filter((p) => p.status === "completed").length,
    pending: payments.filter((p) => p.status === "pending").length,
    failed: payments.filter((p) => p.status === "failed").length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    cardPayments: payments.filter((p) => p.paymentType === "card").length,
    mobileMoneyPayments: payments.filter((p) => p.paymentType === "mobile_money").length,
    byNetwork: {} as Record<string, number>,
    byCardType: {} as Record<string, number>,
  }

  // Count by mobile money network
  payments.forEach((payment) => {
    if (payment.paymentType === "mobile_money") {
      const method = payment.paymentMethod as {
        type: "mobile_money";
        network: string;
        networkDisplayName?: string;
      }
      const network = method.networkDisplayName || method.network
      stats.byNetwork[network] = (stats.byNetwork[network] || 0) + 1
    }
  })

  // Count by card type
  payments.forEach((payment) => {
    if (payment.paymentType === "card") {
      const method = payment.paymentMethod as {
        type: "card";
        cardType: string;
      }
      const cardType = method.cardType
      stats.byCardType[cardType] = (stats.byCardType[cardType] || 0) + 1
    }
  })

  return stats
}
