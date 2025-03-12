import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import Coupon from '../models/coupon.model.js';
import Stripe from 'stripe';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get user's orders
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });

    res.status(200).json(
      new ApiResponse(200, orders, "Orders retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get order details
export const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: id, user: userId })
      .populate('items.product', 'name price images')
      .populate('coupon', 'code discountType discountAmount');

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    res.status(200).json(
      new ApiResponse(200, order, "Order details retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Create new order
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name price stock');

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    // Validate stock
    for (const item of cart.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price
    }));

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod
      },
      subtotal: cart.total + cart.discount,
      discount: cart.discount,
      shippingAmount: 10, // Fixed shipping cost
      total: cart.total + 10,
      coupon: cart.coupon
    });

    // Process payment if using Stripe
    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.total * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: order._id.toString()
        }
      });

      order.paymentInfo.id = paymentIntent.id;
      await order.save();
    }

    // Clear cart
    await cart.clearCart();

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Update coupon usage if applied
    if (order.coupon) {
      await Coupon.findByIdAndUpdate(
        order.coupon,
        { $inc: { usedCount: 1 } }
      );
    }

    res.status(201).json(
      new ApiResponse(201, order, "Order created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Cancel order
export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.status === 'delivered') {
      throw new ApiError(400, "Cannot cancel delivered order");
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    // Restore coupon usage if applied
    if (order.coupon) {
      await Coupon.findByIdAndUpdate(
        order.coupon,
        { $inc: { usedCount: -1 } }
      );
    }

    // Cancel payment if using Stripe
    if (order.paymentInfo.method === 'stripe' && order.paymentInfo.id) {
      await stripe.paymentIntents.cancel(order.paymentInfo.id);
    }

    await order.cancelOrder();

    res.status(200).json(
      new ApiResponse(200, order, "Order cancelled successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get order invoice
export const getOrderInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: id, user: userId })
      .populate('items.product', 'name price')
      .populate('coupon', 'code discountType discountAmount');

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // Generate invoice data
    const invoice = {
      orderId: order._id,
      date: order.createdAt,
      items: order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      })),
      subtotal: order.subtotal,
      discount: order.discount,
      shippingAmount: order.shippingAmount,
      total: order.total,
      shippingAddress: order.shippingAddress,
      status: order.status
    };

    res.status(200).json(
      new ApiResponse(200, invoice, "Invoice retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    await order.updateStatus(status);

    res.status(200).json(
      new ApiResponse(200, order, "Order status updated successfully")
    );
  } catch (error) {
    next(error);
  }
}; 