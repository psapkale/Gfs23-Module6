import Product from '../models/product.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Create a new product
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, brand, stock } = req.body;
    const imageFiles = req.files;

    // Validate category and brand existence
    const categoryExists = await Category.findById(category);
    const brandExists = await Brand.findById(brand);

    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }
    if (!brandExists) {
      throw new ApiError(404, "Brand not found");
    }

    // Upload images to Cloudinary
    const images = [];
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const result = await uploadToCloudinary(file.path);
        images.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      stock,
      images
    });

    res.status(201).json(
      new ApiResponse(201, product, "Product created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get all products with filtering and pagination
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      brand,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Apply filters
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Apply sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('brand', 'name')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json(
      new ApiResponse(200, {
        products,
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page)
      }, "Products retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get product by ID or slug
export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('ratings.user', 'name');

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    res.status(200).json(
      new ApiResponse(200, product, "Product retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, brand, stock, isActive } = req.body;
    const imageFiles = req.files;

    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Validate category and brand if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        throw new ApiError(404, "Category not found");
      }
    }

    if (brand) {
      const brandExists = await Brand.findById(brand);
      if (!brandExists) {
        throw new ApiError(404, "Brand not found");
      }
    }

    // Update images if new files are uploaded
    if (imageFiles && imageFiles.length > 0) {
      // Delete old images from Cloudinary
      for (const image of product.images) {
        if (image.public_id) {
          await deleteFromCloudinary(image.public_id);
        }
      }

      // Upload new images
      const images = [];
      for (const file of imageFiles) {
        const result = await uploadToCloudinary(file.path);
        images.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
      product.images = images;
    }

    // Update other fields
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (stock !== undefined) product.stock = stock;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    res.status(200).json(
      new ApiResponse(200, product, "Product updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      if (image.public_id) {
        await deleteFromCloudinary(image.public_id);
      }
    }

    await product.deleteOne();

    res.status(200).json(
      new ApiResponse(200, null, "Product deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Add product rating
export const addProductRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Check if user has already rated
    const existingRating = product.ratings.find(
      r => r.user.toString() === userId.toString()
    );

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review;
    } else {
      // Add new rating
      product.ratings.push({
        user: userId,
        rating,
        review
      });
    }

    // Update average rating
    await product.updateAverageRating();
    await product.save();

    res.status(200).json(
      new ApiResponse(200, product, "Rating added successfully")
    );
  } catch (error) {
    next(error);
  }
}; 