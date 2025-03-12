import express from 'express';
import multer from 'multer';
import {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand
} from '../controllers/brand.controller.js';
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
router.get('/', getAllBrands);
router.get('/:id', getBrand);

// Protected routes (admin only)
router.post(
  '/',
  isAuthenticated,
  authorizeRoles('admin'),
  upload.single('logo'),
  createBrand
);

router.put(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  upload.single('logo'),
  updateBrand
);

router.delete(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteBrand
);

export default router; 