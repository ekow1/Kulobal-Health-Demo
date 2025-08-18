import { Hono } from 'hono';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { auth, requireRole } from '../middleware/auth.js';
import { z } from 'zod';

const orderRouter = new Hono();

// Validation schemas
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive(),
    category: z.string().optional(),
    image: z.string().optional(),
  })),
  subtotal: z.number().positive(),
  deliveryFee: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().positive(),
  currency: z.string().default('GHS'),
  shippingDetails: z.object({
    pharmacyName: z.string(),
    phoneNumber: z.string(),
    pharmacyEmail: z.string(),
    pharmacyLocation: z.string(),
    streetAddress: z.string().optional(),
    gpsAddress: z.string().optional(),
  }),
  paymentDetails: z.object({
    paymentType: z.enum(['full-payment', 'partial-payment', 'deposit', 'credit', 'installment-payment']),
    paymentMethod: z.enum(['pay-on-delivery', 'online-payment', 'mobile-money', 'cash-on-delivery', 'pay-online']),
    amount: z.number().positive(),
    currency: z.string().default('GHS'),
    transactionId: z.string().optional(),
  }),
  notes: z.string().optional(),
  estimatedDelivery: z.string().optional(), // ISO date string
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  trackingUpdate: z.object({
    status: z.string(),
    description: z.string().optional(),
    location: z.string().optional(),
  }).optional(),
  cancelledReason: z.string().optional(),
  estimatedDelivery: z.string().optional(), // ISO date string
});

// Create new order
orderRouter.post('/', auth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const validatedData = createOrderSchema.parse(body);
    
    // Create order data
    const orderData = {
      userId: user._id,
      items: validatedData.items,
      subtotal: validatedData.subtotal,
      deliveryFee: validatedData.deliveryFee,
      tax: validatedData.tax,
      total: validatedData.total,
      currency: validatedData.currency,
      shippingDetails: validatedData.shippingDetails,
      paymentDetails: {
        ...validatedData.paymentDetails,
        status: 'pending',
      },
      notes: validatedData.notes,
      ...(validatedData.estimatedDelivery && {
        estimatedDelivery: new Date(validatedData.estimatedDelivery)
      }),
    };
    
    // Create new order
    const order = new Order(orderData);
    await order.save();
    
    // If there's a transaction ID, link it to a payment
    if (validatedData.paymentDetails.transactionId) {
      await Payment.findOneAndUpdate(
        { transactionId: validatedData.paymentDetails.transactionId },
        { 
          $set: { 
            'metadata.orderId': order.orderNumber,
            'metadata.orderDetails': {
              orderId: order._id,
              orderNumber: order.orderNumber,
              total: order.total,
              items: order.items
            }
          }
        }
      );
    }
    
    return c.json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    }, 201);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, 400);
    }
    
    console.error('Create order error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Get all orders (admin only)
orderRouter.get('/', auth, requireRole(['admin']), async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const status = c.req.query('status');
    const userId = c.req.query('userId');
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');
    
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (userId) {
      query.userId = userId;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('userId', 'businessName ownerName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(query);
    
    return c.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get orders error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Get user's orders
orderRouter.get('/my-orders', auth, async (c) => {
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
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(query);
    
    return c.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get user orders error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Get order by ID
orderRouter.get('/:id', auth, async (c) => {
  try {
    const user = c.get('user');
    const orderId = c.req.param('id');
    
    const order = await Order.findById(orderId)
      .populate('userId', 'businessName ownerName email');
    
    if (!order) {
      return c.json({
        success: false,
        message: 'Order not found'
      }, 404);
    }
    
    // Check if user can access this order
    if (order.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return c.json({
        success: false,
        message: 'Access denied'
      }, 403);
    }
    
    return c.json({
      success: true,
      data: { order }
    });
    
  } catch (error) {
    console.error('Get order error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Update order status (admin only)
orderRouter.patch('/:id/status', auth, requireRole(['admin']), async (c) => {
  try {
    const orderId = c.req.param('id');
    const body = await c.req.json();
    const validatedData = updateOrderStatusSchema.parse(body);
    
    const updateData = {
      status: validatedData.status,
      updatedAt: new Date()
    };
    
    // Add tracking update if provided
    if (validatedData.trackingUpdate) {
      updateData.$push = {
        tracking: {
          status: validatedData.trackingUpdate.status,
          date: new Date(),
          description: validatedData.trackingUpdate.description,
          location: validatedData.trackingUpdate.location
        }
      };
    }
    
    // Handle specific status updates
    if (validatedData.status === 'delivered') {
      updateData.deliveredAt = new Date();
    } else if (validatedData.status === 'cancelled') {
      updateData.cancelledAt = new Date();
      updateData.cancelledReason = validatedData.cancelledReason || 'Order cancelled by admin';
    }
    
    if (validatedData.estimatedDelivery) {
      updateData.estimatedDelivery = new Date(validatedData.estimatedDelivery);
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('userId', 'businessName ownerName email');
    
    if (!order) {
      return c.json({
        success: false,
        message: 'Order not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, 400);
    }
    
    console.error('Update order status error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Cancel order (user can cancel their own pending orders)
orderRouter.patch('/:id/cancel', auth, async (c) => {
  try {
    const user = c.get('user');
    const orderId = c.req.param('id');
    const body = await c.req.json();
    const { reason } = body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return c.json({
        success: false,
        message: 'Order not found'
      }, 404);
    }
    
    // Check if user can cancel this order
    if (order.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return c.json({
        success: false,
        message: 'Access denied'
      }, 403);
    }
    
    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return c.json({
        success: false,
        message: 'Only pending orders can be cancelled'
      }, 400);
    }
    
    // Update order status
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelledReason = reason || 'Cancelled by customer';
    order.tracking.push({
      status: 'Order Cancelled',
      date: new Date(),
      description: reason || 'Order cancelled by customer'
    });
    
    await order.save();
    
    return c.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
    
  } catch (error) {
    console.error('Cancel order error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Get order statistics (admin only)
orderRouter.get('/stats/overview', auth, requireRole(['admin']), async (c) => {
  try {
    const [totalOrders, totalRevenue, pendingOrders, processingOrders] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $in: ['delivered', 'shipped'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'processing' })
    ]);
    
    const totalRevenueValue = totalRevenue[0]?.total || 0;
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get orders by payment method
    const ordersByPaymentMethod = await Order.aggregate([
      { $group: { _id: '$paymentDetails.paymentMethod', count: { $sum: 1 } } }
    ]);
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'businessName ownerName email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const stats = {
      totalOrders,
      totalRevenue: totalRevenueValue,
      pendingOrders,
      processingOrders,
      byStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byPaymentMethod: ordersByPaymentMethod.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentOrders
    };
    
    return c.json({
      success: true,
      data: { stats }
    });
    
  } catch (error) {
    console.error('Get order stats error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

export default orderRouter;

