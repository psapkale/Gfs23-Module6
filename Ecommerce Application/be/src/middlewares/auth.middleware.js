import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';

// Verify JWT token
export const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Please provide a valid token');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(401, 'User account is deactivated');
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      throw new ApiError(401, 'User recently changed password. Please login again');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid token'));
      return;
    }
    if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token expired'));
      return;
    }
    next(error);
  }
};

// Role-based authorization
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Access denied. ${req.user.role} role is not allowed to access this resource`);
    }
    next();
  };
};

// Optional authentication (for routes that can be accessed with or without authentication)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (user && user.isActive) {
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
};

// Check if user is accessing their own resource
export const isOwner = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      if (!resource) {
        throw new ApiError(404, 'Resource not found');
      }

      if (resource.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Access denied. You can only access your own resources');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 