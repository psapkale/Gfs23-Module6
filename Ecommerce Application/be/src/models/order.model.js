import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity cannot be less than 1"]
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  paymentInfo: {
    id: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['stripe', 'cod'],
      required: true
    }
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  discount: {
    type: Number,
    default: 0
  },
  shippingAmount: {
    type: Number,
    required: true,
    default: 0
  },
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveredAt: Date
}, {
  timestamps: true
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  this.calculateTotals();
  next();
});

// Method to calculate order totals
orderSchema.methods.calculateTotals = function() {
  let subtotal = 0;
  
  this.items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  this.subtotal = subtotal;
  this.total = subtotal + this.shippingAmount - this.discount;
};

// Method to update order status
orderSchema.methods.updateStatus = async function(status) {
  this.status = status;
  
  if (status === 'delivered') {
    this.deliveredAt = new Date();
    
    // Update product stock
    for (const item of this.items) {
      await this.model('Product').findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }
  }
  
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = async function() {
  if (this.status === 'delivered') {
    throw new Error('Cannot cancel delivered order');
  }
  
  this.status = 'cancelled';
  
  // Restore product stock if order was processing
  if (this.status === 'processing') {
    for (const item of this.items) {
      await this.model('Product').findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }
  }
  
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

export default Order; 