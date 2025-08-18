import mongoose, { Schema } from 'mongoose';

const orderItemSchema = new Schema({
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

const shippingDetailsSchema = new Schema({
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

const paymentDetailsSchema = new Schema({
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

const orderTrackingSchema = new Schema({
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

const orderSchema = new Schema({
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

export const Order = mongoose.model('Order', orderSchema);

