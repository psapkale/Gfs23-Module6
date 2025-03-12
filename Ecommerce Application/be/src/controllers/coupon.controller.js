import Coupon from '../models/coupon.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Create new coupon
export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountAmount,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      usageLimit
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      throw new ApiError(400, "Coupon code already exists");
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountAmount,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      usageLimit
    });

    res.status(201).json(
      new ApiResponse(201, coupon, "Coupon created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get all coupons
export const getAllCoupons = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Coupon.countDocuments(query);

    res.status(200).json(
      new ApiResponse(200, {
        coupons,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      }, "Coupons retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get coupon by code
export const getCouponByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }

    res.status(200).json(
      new ApiResponse(200, coupon, "Coupon retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Update coupon
export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If code is being updated, check if new code exists
    if (updateData.code) {
      const existingCoupon = await Coupon.findOne({
        code: updateData.code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingCoupon) {
        throw new ApiError(400, "Coupon code already exists");
      }
      updateData.code = updateData.code.toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }

    res.status(200).json(
      new ApiResponse(200, coupon, "Coupon updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Delete coupon
export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }

    res.status(200).json(
      new ApiResponse(200, coupon, "Coupon deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Validate coupon
export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { subtotal } = req.query;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }

    const isValid = await coupon.isValid();
    if (!isValid) {
      throw new ApiError(400, "Coupon is not valid");
    }

    // Check minimum purchase amount
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      throw new ApiError(400, `Minimum purchase amount of ${coupon.minPurchase} required`);
    }

    const discount = await coupon.calculateDiscount(subtotal);

    res.status(200).json(
      new ApiResponse(200, {
        isValid: true,
        discount,
        coupon
      }, "Coupon validated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get coupon analytics
export const getCouponAnalytics = async (req, res, next) => {
  try {
    const analytics = await Coupon.aggregate([
      {
        $group: {
          _id: null,
          totalCoupons: { $sum: 1 },
          activeCoupons: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
          },
          totalUsage: { $sum: "$usedCount" },
          averageUsage: { $avg: "$usedCount" }
        }
      }
    ]);

    const recentCoupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('code discountType discountAmount usedCount isActive');

    res.status(200).json(
      new ApiResponse(200, {
        analytics: analytics[0] || {
          totalCoupons: 0,
          activeCoupons: 0,
          totalUsage: 0,
          averageUsage: 0
        },
        recentCoupons
      }, "Coupon analytics retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
}; 