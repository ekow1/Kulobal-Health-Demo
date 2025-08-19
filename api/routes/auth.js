import { Hono } from 'hono';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { auth, requireRole } from '../middleware/auth.js';
import { z } from 'zod';

const authRouter = new Hono();

// Test endpoint - no authentication required
authRouter.get('/test', async (c) => {
  return c.json({
    success: true,
    message: 'Auth router is working',
    timestamp: new Date().toISOString()
  });
});

// Validation schemas
const registerSchema = z.object({
  businessName: z.string().min(2).max(100),
  ownerName: z.string().min(2).max(100),
  location: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().min(10),
  password: z.string().min(6),
  role: z.enum(['pharmacy', 'supplier', 'otc', 'admin']),
  pharmacyName: z.string().optional(),
  phoneNumber: z.string().optional(),
  pharmacyEmail: z.string().email().optional(),
  pharmacyLocation: z.string().optional(),
  streetAddress: z.string().optional(),
  gpsAddress: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Generate JWT token
const generateToken = (userId, email, role) => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(
    { userId, email, role },
    secret,
    { expiresIn }
  );
};

// Register new user
authRouter.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return c.json({
        success: false,
        message: 'User with this email already exists'
      }, 400);
    }
    
    // Create new user
    const user = new User(validatedData);
    await user.save();
    
    // Generate token
    const token = generateToken(String(user._id), user.email, user.role);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    
    return c.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          businessName: user.businessName,
          ownerName: user.ownerName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        }
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
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.username) {
        // This is a legacy username index issue
        console.error('Legacy username index error:', error);
        return c.json({
          success: false,
          message: 'Registration failed due to database configuration issue. Please contact support.'
        }, 500);
      }
      
      if (error.keyPattern && error.keyPattern.email) {
        return c.json({
          success: false,
          message: 'User with this email already exists'
        }, 400);
      }
      
      return c.json({
        success: false,
        message: 'Duplicate entry found'
      }, 400);
    }
    
    console.error('Register error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Login user
authRouter.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = loginSchema.parse(body);
    
    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return c.json({
        success: false,
        message: 'Invalid email or password'
      }, 401);
    }
    
    // Check if user is active
    if (!user.isActive) {
      return c.json({
        success: false,
        message: 'Account is deactivated'
      }, 401);
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return c.json({
        success: false,
        message: 'Invalid email or password'
      }, 401);
    }
    
    // Generate token
    const token = generateToken(String(user._id), user.email, user.role);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Set HTTP-only cookie with userId
    const cookieValue = `userId=${(user._id).toString()}; HttpOnly; Path=/; Domain=.ekowlabs.space; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
    const secureCookie = process.env.NODE_ENV === 'production' ? `${cookieValue}; Secure` : cookieValue;
    c.header('Set-Cookie', secureCookie);
    
    return c.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          businessName: user.businessName,
          ownerName: user.ownerName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, 400);
    }
    
    console.error('Login error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Get current user profile
authRouter.get('/profile',  async (c) => {
  try {
    const user = c.get('user');
    
    return c.json({
      success: true,
      data: { user }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Update user profile
authRouter.put('/profile', auth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    
    // Fields that can be updated
    const allowedFields = [
      'businessName', 'ownerName', 'location', 'telephone',
      'pharmacyName', 'phoneNumber', 'pharmacyEmail', 'pharmacyLocation',
      'streetAddress', 'gpsAddress'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });
    
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    return c.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Change password
authRouter.put('/change-password', auth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    
    const { currentPassword, newPassword } = body;
    
    if (!currentPassword || !newPassword) {
      return c.json({
        success: false,
        message: 'Current password and new password are required'
      }, 400);
    }
    
    if (newPassword.length < 6) {
      return c.json({
        success: false,
        message: 'New password must be at least 6 characters long'
      }, 400);
    }
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return c.json({
        success: false,
        message: 'Current password is incorrect'
      }, 400);
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    return c.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Get all users (admin only)
authRouter.get('/users', auth, requireRole(['admin']), async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const role = c.req.query('role');
    const search = c.req.query('search');
    
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(query);
    
    return c.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

// Logout user
authRouter.post('/logout', async (c) => {
  try {
    // Clear the userId cookie by setting it to expire in the past
    c.header('Set-Cookie', 'userId=; HttpOnly; Path=/; Domain=.ekowlabs.space; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    
    return c.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
});

export default authRouter;
