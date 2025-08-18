import mongoose, { Schema } from 'mongoose';

const paymentMethodSchema = new Schema({
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

const shippingDetailsSchema = new Schema({
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

const orderItemSchema = new Schema({
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

const paymentMetadataSchema = new Schema({
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

const paymentSchema = new Schema({
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

export const Payment = mongoose.model('Payment', paymentSchema);
