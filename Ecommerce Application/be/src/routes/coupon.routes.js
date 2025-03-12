import express from 'express';
import {
  createCoupon,
  getAllCoupons,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getCouponAnalytics
} from '../controllers/coupon.controller.js';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/validate/:code', validateCoupon);

// Admin routes
router.use(isAuthenticated);
router.use(authorizeRoles('admin'));

router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.get('/analytics', getCouponAnalytics);
router.get('/:code', getCouponByCode);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router; 