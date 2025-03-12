import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import Coupon from '../models/coupon.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Get user's cart
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find or create cart
    let cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name price images stock')
      .populate('coupon', 'code discountType discountAmount');

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    res.status(200).json(
      new ApiResponse(200, cart, "Cart retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Add item to cart
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.stock < quantity) {
      throw new ApiError(400, "Insufficient stock");
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      // Update quantity if product exists
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new ApiError(400, "Insufficient stock");
      }
      existingItem.quantity = newQuantity;
    } else {
      // Add new item if product doesn't exist
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    // Calculate totals
    await cart.calculateTotals();
    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images stock');
    await cart.populate('coupon', 'code discountType discountAmount');

    res.status(200).json(
      new ApiResponse(200, cart, "Item added to cart successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (quantity < 1) {
      throw new ApiError(400, "Quantity must be at least 1");
    }

    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.stock < quantity) {
      throw new ApiError(400, "Insufficient stock");
    }

    // Update item quantity
    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      throw new ApiError(404, "Item not found in cart");
    }

    item.quantity = quantity;

    // Calculate totals
    await cart.calculateTotals();
    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images stock');
    await cart.populate('coupon', 'code discountType discountAmount');

    res.status(200).json(
      new ApiResponse(200, cart, "Cart item updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    // Remove item
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    // Calculate totals
    await cart.calculateTotals();
    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images stock');
    await cart.populate('coupon', 'code discountType discountAmount');

    res.status(200).json(
      new ApiResponse(200, cart, "Item removed from cart successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Clear cart
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    // Clear items and reset totals
    cart.items = [];
    cart.coupon = null;
    cart.discount = 0;
    cart.total = 0;

    await cart.save();

    res.status(200).json(
      new ApiResponse(200, cart, "Cart cleared successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Apply coupon to cart
export const applyCoupon = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { code } = req.body;

    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    if (cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    // Find and validate coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }

    const isValid = await coupon.isValid();
    if (!isValid) {
      throw new ApiError(400, "Coupon is not valid");
    }

    // Check minimum purchase amount
    if (coupon.minPurchase && cart.total < coupon.minPurchase) {
      throw new ApiError(400, `Minimum purchase amount of ${coupon.minPurchase} required`);
    }

    // Apply coupon
    cart.coupon = coupon._id;
    await cart.calculateTotals();
    await cart.save();

    // Populate product and coupon details
    await cart.populate('items.product', 'name price images stock');
    await cart.populate('coupon', 'code discountType discountAmount');

    res.status(200).json(
      new ApiResponse(200, cart, "Coupon applied successfully")
    );
  } catch (error) {
    next(error);
  }
}; 