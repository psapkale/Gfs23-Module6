import Category from '../models/category.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, parent } = req.body;
    const imageFile = req.file;

    // Check if category with same name exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new ApiError(400, "Category with this name already exists");
    }

    // Upload image to Cloudinary if provided
    let image = {};
    if (imageFile) {
      const result = await uploadToCloudinary(imageFile.path);
      image = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    const category = await Category.create({
      name,
      description,
      parent,
      image
    });

    res.status(201).json(
      new ApiResponse(201, category, "Category created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate('parent', 'name')
      .sort({ name: 1 });

    res.status(200).json(
      new ApiResponse(200, categories, "Categories retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get category by ID or slug
export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id)
      .populate('parent', 'name');

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    res.status(200).json(
      new ApiResponse(200, category, "Category retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Update category
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, parent, isActive } = req.body;
    const imageFile = req.file;

    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        throw new ApiError(400, "Category with this name already exists");
      }
    }

    // Update image if new file is uploaded
    if (imageFile) {
      // Delete old image from Cloudinary if exists
      if (category.image?.public_id) {
        await deleteFromCloudinary(category.image.public_id);
      }

      const result = await uploadToCloudinary(imageFile.path);
      category.image = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    // Update other fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (parent !== undefined) category.parent = parent;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json(
      new ApiResponse(200, category, "Category updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Delete category
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // Delete image from Cloudinary if exists
    if (category.image?.public_id) {
      await deleteFromCloudinary(category.image.public_id);
    }

    await category.deleteOne();

    res.status(200).json(
      new ApiResponse(200, null, "Category deleted successfully")
    );
  } catch (error) {
    next(error);
  }
}; 