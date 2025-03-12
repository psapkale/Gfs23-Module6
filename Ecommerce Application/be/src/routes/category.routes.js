import express from 'express';
import multer from 'multer';
import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
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
router.get('/', getAllCategories);
router.get('/:id', getCategory);

// Protected routes (admin only)
router.post(
  '/',
  isAuthenticated,
  authorizeRoles('admin'),
  upload.single('image'),
  createCategory
);

router.put(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  upload.single('image'),
  updateCategory
);

router.delete(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteCategory
);

export default router; 