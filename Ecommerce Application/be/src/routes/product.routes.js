import express from 'express';
import multer from 'multer';
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addProductRating
} from '../controllers/product.controller.js';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes (admin only)
router.post(
  '/',
  isAuthenticated,
  authorizeRoles('admin'),
  upload.array('images', 5), // Allow up to 5 images
  createProduct
);

router.put(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  upload.array('images', 5),
  updateProduct
);

router.delete(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteProduct
);

// User routes (authenticated users)
router.post(
  '/:id/ratings',
  isAuthenticated,
  addProductRating
);

export default router; 