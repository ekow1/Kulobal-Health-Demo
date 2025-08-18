import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
  image?: string;
}

export interface IShippingDetails {
  pharmacyName: string;
  phoneNumber: string;
  pharmacyEmail: string;
  pharmacyLocation: string;
  streetAddress?: string;
  gpsAddress?: string;
}

export interface IPaymentDetails {
  paymentType: 'full-payment' | 'partial-payment' | 'deposit' | 'credit' | 'installment-payment';
  paymentMethod: 'pay-on-delivery' | 'online-payment' | 'mobile-money' | 'cash-on-delivery' | 'pay-online';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  transactionId?: string;
}

export interface IOrderTracking {
  status: string;
  date: Date;
  description?: string;
  location?: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  currency: string;
  shippingDetails: IShippingDetails;
  paymentDetails: IPaymentDetails;
  tracking: IOrderTracking[];
  notes?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelledReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: String,
  },
  name: {
    type: String,
    required: true
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
  category: {
    type: String
  },
  image: {
    type: String
  }
});

const shippingDetailsSchema = new Schema<IShippingDetails>({
  pharmacyName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  pharmacyEmail: {
    type: String,
    required: true
  },
  pharmacyLocation: {
    type: String,
    required: true
  },
  streetAddress: {
    type: String
  },
  gpsAddress: {
    type: String
  }
});

const paymentDetailsSchema = new Schema<IPaymentDetails>({
  paymentType: {
    type: String,
    enum: ['full-payment', 'partial-payment', 'deposit', 'credit', 'installment-payment'],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['pay-on-delivery', 'online-payment', 'mobile-money', 'cash-on-delivery', 'pay-online'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'GHS'
  },
  status: {
    type: String,

    default: 'pending'
  },
  transactionId: {
    type: String
  }
});

const orderTrackingSchema = new Schema<IOrderTracking>({
  status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  },
  location: {
    type: String
  }
});

const orderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'GHS'
  },
  shippingDetails: {
    type: shippingDetailsSchema,
    required: true
  },
  paymentDetails: {
    type: paymentDetailsSchema,
    required: true
  },
  tracking: [orderTrackingSchema],
  notes: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelledReason: {
    type: String
  }
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ORD${year}${month}${day}${random}`;
  }
  next();
});

// Add initial tracking entry
orderSchema.pre('save', function(next) {
  if (this.isNew && this.tracking.length === 0) {
    this.tracking.push({
      status: 'Order Placed',
      date: new Date(),
      description: 'Order has been placed successfully'
    });
  }
  next();
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);

