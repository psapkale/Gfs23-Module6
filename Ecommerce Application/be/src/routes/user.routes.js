import express from 'express';
import multer from 'multer';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  changePassword,
  getAllUsers,
  updateUserRole
} from '../controllers/user.controller.js';
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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.use(isAuthenticated);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/avatar', upload.single('avatar'), updateUserAvatar);
router.put('/change-password', changePassword);

// Admin routes
router.use(authorizeRoles('admin'));

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);

export default router; 