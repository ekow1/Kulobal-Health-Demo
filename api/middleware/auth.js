import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    user: any;
  }
}

export const auth = async (c, next) => {
  try {
    // Get userId from cookie
    const userId = c.req.header('Cookie')?.split('userId=')[1]?.split(';')[0];
    
    if (!userId) {
      return c.json({ 
        success: false, 
        message: 'User not authenticated.' 
      }, 401);
    }
    
    // Get user from database
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return c.json({ 
        success: false, 
        message: 'User not found.' 
      }, 401);
    }

    if (!user.isActive) {
      return c.json({ 
        success: false, 
        message: 'Account is deactivated.' 
      }, 401);
    }

    // Add user to context
    c.set('user', user);
    
    await next();
    return;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ 
      success: false, 
      message: 'Authentication error.' 
    }, 401);
  }
};

export const optionalAuth = async (c, next) => {
  try {
    // Get userId from cookie
    const userId = c.req.header('Cookie')?.split('userId=')[1]?.split(';')[0];
    
    if (userId) {
      const user = await User.findById(userId).select('-password');
      
      if (user && user.isActive) {
        c.set('user', user);
      }
    }
    
    await next();
  } catch (error) {
    // Continue without authentication
    await next();
  }
  return;
};

export const requireRole = (roles) => {
  return async (c, next) => {
    const user = c.get('user');
    
    if (!user) {
      return c.json({ 
        success: false, 
        message: 'Authentication required.' 
      }, 401);
    }
    
    if (!roles.includes(user.role)) {
      return c.json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions.' 
      }, 403);
    }
    
    await next();
    return;
  };
};
