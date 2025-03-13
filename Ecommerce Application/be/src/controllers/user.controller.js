import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Register new user
export const registerUser = async (req, res, next) => {
   try {
      const { name, email, password, phoneNumber } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         throw new ApiError(400, "User with this email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with hashed password
      const user = await User.create({
         name,
         email,
         password: hashedPassword,
         phoneNumber,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
         expiresIn: process.env.JWT_EXPIRES_IN,
      });

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json(
         new ApiResponse(
            201,
            {
               user: userResponse,
               token,
            },
            "User registered successfully"
         )
      );
   } catch (error) {
      next(error);
   }
};

// Login user
export const loginUser = async (req, res, next) => {
   try {
      const { email, password } = req.body;

      // Find user and explicitly select password
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
         throw new ApiError(401, "Invalid email or password");
      }

      // Check password using bcrypt.compare directly
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         throw new ApiError(401, "Invalid email or password");
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
         expiresIn: process.env.JWT_EXPIRES_IN,
      });

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json(
         new ApiResponse(
            200,
            {
               user: userResponse,
               token,
            },
            "User logged in successfully"
         )
      );
   } catch (error) {
      next(error);
   }
};

// Get user profile
export const getUserProfile = async (req, res, next) => {
   try {
      const userId = req.user._id;
      const user = await User.findById(userId).select("-password");

      if (!user) {
         throw new ApiError(404, "User not found");
      }

      res.status(200).json(
         new ApiResponse(200, user, "User profile retrieved successfully")
      );
   } catch (error) {
      next(error);
   }
};

// Update user profile
export const updateUserProfile = async (req, res, next) => {
   try {
      const userId = req.user._id;
      const { name, email, phoneNumber } = req.body;

      // Check if email is being updated and if it's already taken
      if (email) {
         const existingUser = await User.findOne({
            email,
            _id: { $ne: userId },
         });
         if (existingUser) {
            throw new ApiError(400, "Email already in use");
         }
      }

      const user = await User.findByIdAndUpdate(
         userId,
         { $set: { name, email, phoneNumber } },
         { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
         throw new ApiError(404, "User not found");
      }

      res.status(200).json(
         new ApiResponse(200, user, "User profile updated successfully")
      );
   } catch (error) {
      next(error);
   }
};

// Update user avatar
export const updateUserAvatar = async (req, res, next) => {
   try {
      const userId = req.user._id;

      if (!req.file) {
         throw new ApiError(400, "Please upload an image");
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(req.file.path);

      const user = await User.findByIdAndUpdate(
         userId,
         { $set: { avatar: result.secure_url } },
         { new: true }
      ).select("-password");

      if (!user) {
         throw new ApiError(404, "User not found");
      }

      res.status(200).json(
         new ApiResponse(200, user, "User avatar updated successfully")
      );
   } catch (error) {
      next(error);
   }
};

// Change password
export const changePassword = async (req, res, next) => {
   try {
      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(userId);
      if (!user) {
         throw new ApiError(404, "User not found");
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
         currentPassword,
         user.password
      );
      if (!isPasswordValid) {
         throw new ApiError(401, "Current password is incorrect");
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json(
         new ApiResponse(200, null, "Password changed successfully")
      );
   } catch (error) {
      next(error);
   }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res, next) => {
   try {
      const { page = 1, limit = 10 } = req.query;
      const users = await User.find()
         .select("-password")
         .limit(limit * 1)
         .skip((page - 1) * limit)
         .sort({ createdAt: -1 });

      const total = await User.countDocuments();

      res.status(200).json(
         new ApiResponse(
            200,
            {
               users,
               totalPages: Math.ceil(total / limit),
               currentPage: page,
            },
            "Users retrieved successfully"
         )
      );
   } catch (error) {
      next(error);
   }
};

// Update user role (Admin only)
export const updateUserRole = async (req, res, next) => {
   try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await User.findByIdAndUpdate(
         id,
         { $set: { role } },
         { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
         throw new ApiError(404, "User not found");
      }

      res.status(200).json(
         new ApiResponse(200, user, "User role updated successfully")
      );
   } catch (error) {
      next(error);
   }
};
