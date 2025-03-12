import Brand from '../models/brand.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Create a new brand
export const createBrand = async (req, res, next) => {
  try {
    const { name, description, website } = req.body;
    const logoFile = req.file;

    // Check if brand with same name exists
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      throw new ApiError(400, "Brand with this name already exists");
    }

    // Upload logo to Cloudinary if provided
    let logo = {};
    if (logoFile) {
      const result = await uploadToCloudinary(logoFile.path);
      logo = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    const brand = await Brand.create({
      name,
      description,
      website,
      logo
    });

    res.status(201).json(
      new ApiResponse(201, brand, "Brand created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get all brands
export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });

    res.status(200).json(
      new ApiResponse(200, brands, "Brands retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get brand by ID or slug
export const getBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) {
      throw new ApiError(404, "Brand not found");
    }

    res.status(200).json(
      new ApiResponse(200, brand, "Brand retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Update brand
export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, website, isActive } = req.body;
    const logoFile = req.file;

    const brand = await Brand.findById(id);
    if (!brand) {
      throw new ApiError(404, "Brand not found");
    }

    // Check if new name conflicts with existing brand
    if (name && name !== brand.name) {
      const existingBrand = await Brand.findOne({ name });
      if (existingBrand) {
        throw new ApiError(400, "Brand with this name already exists");
      }
    }

    // Update logo if new file is uploaded
    if (logoFile) {
      // Delete old logo from Cloudinary if exists
      if (brand.logo?.public_id) {
        await deleteFromCloudinary(brand.logo.public_id);
      }

      const result = await uploadToCloudinary(logoFile.path);
      brand.logo = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    // Update other fields
    if (name) brand.name = name;
    if (description !== undefined) brand.description = description;
    if (website !== undefined) brand.website = website;
    if (isActive !== undefined) brand.isActive = isActive;

    await brand.save();

    res.status(200).json(
      new ApiResponse(200, brand, "Brand updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Delete brand
export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) {
      throw new ApiError(404, "Brand not found");
    }

    // Delete logo from Cloudinary if exists
    if (brand.logo?.public_id) {
      await deleteFromCloudinary(brand.logo.public_id);
    }

    await brand.deleteOne();

    res.status(200).json(
      new ApiResponse(200, null, "Brand deleted successfully")
    );
  } catch (error) {
    next(error);
  }
}; 