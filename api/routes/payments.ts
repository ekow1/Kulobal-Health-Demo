import { Hono } from 'hono';
import { Payment } from '../models/Payment';
import { Order } from '../models/Order';
import { auth, requireRole } from '../middleware/auth';
import { z } from 'zod';

const paymentRouter = new Hono();

// Validation schemas
const createPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('GHS'),
  paymentType: z.enum(['card', 'mobile_money', 'cash on delivery', 'credit']),
  paymentMethod: z.object({
    type: z.enum(['card', 'mobile_money', 'cash']),
    // Card payment fields
    cardType: z.enum(['visa', 'mastercard', 'american_express', 'discover']).optional(),
    last4Digits: z.string().optional(),
    expiryMonth: z.string().optional(),
    expiryYear: z.string().optional(),
    cardholderName: z.string().optional(),
    issuerBank: z.string().optional(),
    // Mobile money fields
    network: z.enum(['mtn', 'vodafone', 'airteltigo', 'telecel']).optional(),
    phoneNumber: z.string().optional(),
    accountName: z.string().optional(),
    networkDisplayName: z.string().optional(),
  }),
  description: z.string(),
  metadata: z.object({
    orderId: z.string(),
    paymentType: z.enum(['full-payment', 'partial-payment', 'deposit', 'installment-payment']),
    paymentMethod: z.enum(['pay-on-delivery', 'online-payment', 'mobile-money', 'cash-on-delivery', 'pay-online']),
    paymentOption: z.string().optional(), // card, mobile_money, etc.
    pharmacyName: z.string(),
    shippingDetails: z.object({
      pharmacyName: z.string(),
      phoneNumber: z.string(),
      pharmacyEmail: z.string(),
      pharmacyLocation: z.string(),
      streetAddress: z.string().optional(),
      gpsAddress: z.string().optional(),
    }),
    items: z.array(z.object({
      id: z.string(),
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
      category: z.string().optional(),
      image: z.string().optional(),
    })),
    itemsSummary: z.string(),
    notes: z.string().optional(),
    // Installment fields
    installmentPercentage: z.number().optional(),
    remainingBalance: z.number().optional(),
    // Card specific fields
    cardType: z.string().optional(),
    last4Digits: z.string().optional(),
    cardholderName: z.string().optional(),
    // Mobile money specific fields
    network: z.string().optional(),
    phoneNumber: z.string().optional(),
  }).optional(),
});

const updatePaymentStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']),
  metadata: z.record(z.any()).optional(),
});

// Generate transaction ID
const generateTransactionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `TXN_${timestamp}_${randomStr.toUpperCase()}`;
};

// Create new payment
paymentRouter.post('/', auth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const validatedData = createPaymentSchema.parse(body);
    
    // Generate transaction ID
    const transactionId = generateTransactionId();
    
    // Create payment data with completed status
    const paymentData = {
      userId: user._id,
      transactionId,
      amount: validatedData.amount,
      currency: validatedData.currency,
      paymentType: validatedData.paymentType,
      paymentMethod: validatedData.paymentMethod,
      status: 'completed' as const, // Set status to completed immediately
      description: validatedData.description,
      metadata: validatedData.metadata || {},
    };
    
    // Create new payment
    const payment = new Payment(paymentData);
    await payment.save();
    
    // Create order from payment metadata
    if (validatedData.metadata) {
      // Generate order number manually
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const orderNumber = `ORD${year}${month}${day}${random}`;
      
      const orderData = {
        userId: user._id,
        orderNumber: orderNumber, // Set order number explicitly
        items: validatedData.metadata.items.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          category: item.category,
          image: item.image,
        })),
        subtotal: validatedData.amount, // Use payment amount as subtotal
        deliveryFee: 0, // Default delivery fee
        tax: 0, // Default tax
        total: validatedData.amount, // Use payment amount as total
        currency: validatedData.currency,
        shippingDetails: validatedData.metadata.shippingDetails,
        paymentDetails: {
          paymentType: validatedData.metadata.paymentType,
          paymentMethod: validatedData.metadata.paymentMethod,
          amount: validatedData.amount,
          currency: validatedData.currency,
          transactionId: transactionId,
          status: 'completed' as const,
        },
        notes: validatedData.metadata.notes,
        tracking: [{
          status: 'Order Placed',
          date: new Date(),
          description: 'Order has been placed successfully'
        }]
      };
      
      // Create new order
      const order = new Order(orderData);
      await order.save();
      
      // Update payment with order information
      payment.metadata = {
        ...payment.metadata,
        orderId: order.orderNumber,
        orderDetails: {
          orderId: String(order._id),
          orderNumber: order.orderNumber,
          total: order.total,
          items: order.items
        }
      };
      await payment.save();
    }
    
    return c.json({
      success: true,
      message: 'Payment completed and order created successfully',
      data: { 
        payment,
        order: validatedData.metadata ? 'Order created' : 'No order data provided'
      }
    }, 201);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, 400);
    }
    
    console.error('Create payment error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Get all payments (admin only)
paymentRouter.get('/', auth, requireRole(['admin']), async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const status = c.req.query('status');
    const paymentType = c.req.query('paymentType');
    const userId = c.req.query('userId');
    
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (paymentType) {
      query.paymentType = paymentType;
    }
    
    if (userId) {
      query.userId = userId;
    }
    
    const skip = (page - 1) * limit;
    
    const payments = await Payment.find(query)
      .populate('userId', 'businessName ownerName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Payment.countDocuments(query);
    
    return c.json({
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get payments error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Get user's payments
paymentRouter.get('/my-payments', auth, async (c) => {
  try {
    const user = c.get('user');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const status = c.req.query('status');
    
    const query: any = { userId: user._id };
    
    if (status) {
      query.status = status;
    }
    
    const skip = (page - 1) * limit;
    
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Payment.countDocuments(query);
    
    return c.json({
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get user payments error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Get payment by ID
paymentRouter.get('/:id', auth, async (c) => {
  try {
    const user = c.get('user');
    const paymentId = c.req.param('id');
    
    const payment = await Payment.findById(paymentId)
      .populate('userId', 'businessName ownerName email');
    
    if (!payment) {
      return c.json({
        success: false,
        message: 'Payment not found'
      }, 404);
    }
    
    // Check if user can access this payment
    if (payment.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return c.json({
        success: false,
        message: 'Access denied'
      }, 403);
    }
    
    return c.json({
      success: true,
      data: { payment }
    });
    
  } catch (error) {
    console.error('Get payment error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Update payment status (admin only)
paymentRouter.patch('/:id/status', auth, requireRole(['admin']), async (c) => {
  try {
    const paymentId = c.req.param('id');
    const body = await c.req.json();
    const validatedData = updatePaymentStatusSchema.parse(body);
    
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: validatedData.status,
        ...(validatedData.metadata && { metadata: validatedData.metadata }),
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'businessName ownerName email');
    
    if (!payment) {
      return c.json({
        success: false,
        message: 'Payment not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      message: 'Payment status updated successfully',
      data: { payment }
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, 400);
    }
    
    console.error('Update payment status error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Get payment statistics (admin only)
paymentRouter.get('/stats/overview', auth, requireRole(['admin']), async (c) => {
  try {
    const [totalPayments, totalAmount, completedPayments, pendingPayments] = await Promise.all([
      Payment.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.countDocuments({ status: 'completed' }),
      Payment.countDocuments({ status: 'pending' })
    ]);
    
    const totalAmountValue = totalAmount[0]?.total || 0;
    
    // Get payments by type
    const paymentsByType = await Payment.aggregate([
      { $group: { _id: '$paymentType', count: { $sum: 1 } } }
    ]);
    
    // Get payments by status
    const paymentsByStatus = await Payment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get recent payments
    const recentPayments = await Payment.find()
      .populate('userId', 'businessName ownerName email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const stats = {
      totalPayments,
      totalAmount: totalAmountValue,
      completedPayments,
      pendingPayments,
      byType: paymentsByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      byStatus: paymentsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      recentPayments
    };
    
    return c.json({
      success: true,
      data: { stats }
    });
    
  } catch (error) {
    console.error('Get payment stats error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

export default paymentRouter;
