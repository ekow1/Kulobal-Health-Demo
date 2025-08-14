import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentMethod {
  type: 'mobile_money' | 'card' | 'bank_transfer' | 'cash';
  network?: 'mtn' | 'vodafone' | 'telecel' | 'airtel';
  phoneNumber?: string;
  accountName?: string;
  networkDisplayName?: string;
  cardNumber?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface IShippingDetails {
  pharmacyName: string;
  phoneNumber: string;
  pharmacyEmail: string;
  pharmacyLocation: string;
  streetAddress?: string;
  gpsAddress?: string;
}

export interface IOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
  image?: string;
}

export interface IPaymentMetadata {
  orderId: string;
  paymentType: 'full-payment' | 'partial-payment' | 'deposit' | 'installment-payment';
  paymentMethod: 'pay-on-delivery' | 'online-payment' | 'mobile-money' | 'cash-on-delivery' | 'pay-online';
  paymentOption?: string; // card, mobile_money, etc.
  pharmacyName: string;
  shippingDetails: IShippingDetails;
  items: IOrderItem[];
  itemsSummary: string;
  notes?: string;
  // Installment fields
  installmentPercentage?: number;
  remainingBalance?: number;
  // Card specific fields
  cardType?: string;
  last4Digits?: string;
  cardholderName?: string;
  // Mobile money specific fields
  network?: string;
  phoneNumber?: string;
  // Order details (added when order is created)
  orderDetails?: {
    orderId: string;
    orderNumber: string;
    total: number;
    items: any[];
  };
}

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  transactionId: string;
  amount: number;
  currency: string;
  paymentType: string;
  paymentMethod: IPaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  description: string;
  metadata: IPaymentMetadata;
  gatewayResponse?: any;
  refundAmount?: number;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentMethodSchema = new Schema<IPaymentMethod>({
  type: {
    type: String,
    enum: ['mobile_money', 'card', 'bank_transfer', 'cash'],
    required: true
  },
  network: {
    type: String,
    enum: ['mtn', 'vodafone', 'telecel', 'airtel']
  },
  phoneNumber: String,
  accountName: String,
  networkDisplayName: String,
  cardNumber: String,
  bankName: String,
  accountNumber: String
});

const shippingDetailsSchema = new Schema<IShippingDetails>({
  pharmacyName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  pharmacyEmail: {
    type: String,
    required: true,
    trim: true
  },
  pharmacyLocation: {
    type: String,
    required: true,
    trim: true
  },
  streetAddress: String,
  gpsAddress: String
});

const orderItemSchema = new Schema<IOrderItem>({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: String,
  image: String
});

const paymentMetadataSchema = new Schema<IPaymentMetadata>({
  orderId: {
    type: String,
    required: true
  },
  paymentType: {
    type: String,
    enum: ['full-payment', 'partial-payment', 'deposit', 'installment-payment'],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['pay-on-delivery', 'online-payment', 'mobile-money', 'cash-on-delivery', 'pay-online'],
    required: true
  },
  paymentOption: String, // card, mobile_money, etc.
  pharmacyName: {
    type: String,
    required: true,
    trim: true
  },
  shippingDetails: {
    type: shippingDetailsSchema,
    required: true
  },
  items: [orderItemSchema],
  itemsSummary: {
    type: String,
    required: true
  },
  notes: String,
  // Installment fields
  installmentPercentage: Number,
  remainingBalance: Number,
  // Card specific fields
  cardType: String,
  last4Digits: String,
  cardholderName: String,
  // Mobile money specific fields
  network: String,
  phoneNumber: String,
  // Order details (added when order is created)
  orderDetails: {
    orderId: String,
    orderNumber: String,
    total: Number,
    items: [Schema.Types.Mixed]
  }
});

const paymentSchema = new Schema<IPayment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'GHS',
    uppercase: true
  },
  paymentType: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: paymentMethodSchema,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  metadata: {
    type: paymentMetadataSchema,
    required: true
  },
  gatewayResponse: Schema.Types.Mixed,
  refundAmount: {
    type: Number,
    min: 0
  },
  refundReason: String
}, {
  timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ userId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ 'metadata.orderId': 1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
