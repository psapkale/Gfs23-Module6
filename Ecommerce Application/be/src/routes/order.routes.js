import express from 'express';
import {
  getUserOrders,
  getOrderDetails,
  createOrder,
  cancelOrder,
  getOrderInvoice,
  updateOrderStatus
} from '../controllers/order.controller.js';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth.middleware.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// User routes (authenticated users)
router.use(isAuthenticated);

router.get('/', getUserOrders);
router.get('/:id', getOrderDetails);
router.post('/', createOrder);
router.put('/:id/cancel', cancelOrder);
router.get('/:id/invoice', getOrderInvoice);

// Admin routes
router.put(
  '/:id/status',
  authorizeRoles('admin'),
  updateOrderStatus
);

// Stripe webhook
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        // Update order payment status
        await Order.findByIdAndUpdate(orderId, {
          'paymentInfo.status': 'completed',
          status: 'processing'
        });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        const failedOrderId = failedPayment.metadata.orderId;

        // Update order payment status
        await Order.findByIdAndUpdate(failedOrderId, {
          'paymentInfo.status': 'failed',
          status: 'cancelled'
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

export default router; 