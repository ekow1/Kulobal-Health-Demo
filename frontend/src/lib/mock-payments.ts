export type PaymentStatus = "delivered" | "processing" | "shipped";

export interface Payment {
  id: string;
  orderNo: string;
  productName: string;
  paymentType: "Full Payment" | "Credit" | "Partial";
  amount: number;
  lastPaymentDate: string;
  amountPaid: number;
  amountRemaining: number;
  status: PaymentStatus;
  date: string;
}

export const mockPayments: Payment[] = [
  {
    id: "1",
    orderNo: "#7578558686",
    productName: "Malaria Test Kit",
    paymentType: "Full Payment",
    amount: 200.0,
    lastPaymentDate: "11th April, 2025",
    amountPaid: 200.0,
    amountRemaining: 0.0,
    status: "delivered",
    date: "20th Mar, 2025",
  },
  {
    id: "2",
    orderNo: "#7578558686",
    productName: "Malaria Test Kit",
    paymentType: "Partial",
    amount: 200.0,
    lastPaymentDate: "11th April, 2025",
    amountPaid: 100.0,
    amountRemaining: 100.0,
    status: "shipped",
    date: "20th Mar, 2025",
  },
  // ... rest of the mock data as provided ...
];
