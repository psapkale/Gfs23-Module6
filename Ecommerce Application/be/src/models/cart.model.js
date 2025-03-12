import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
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

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.calculateTotals();
  next();
});

// Method to calculate cart totals
cartSchema.methods.calculateTotals = function() {
  let subtotal = 0;
  
  this.items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  // Apply discount if coupon exists
  const discount = this.discount || 0;
  this.total = subtotal - discount;
};

// Method to add item to cart
cartSchema.methods.addItem = async function(productId, quantity) {
  const existingItem = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const product = await this.model('Product').findById(productId);
    if (!product) throw new Error('Product not found');
    
    this.items.push({
      product: productId,
      quantity,
      price: product.price
    });
  }

  this.calculateTotals();
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (!item) throw new Error('Item not found in cart');

  if (quantity < 1) {
    this.items = this.items.filter(
      item => item.product.toString() !== productId.toString()
    );
  } else {
    item.quantity = quantity;
  }

  this.calculateTotals();
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
  this.calculateTotals();
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.coupon = null;
  this.discount = 0;
  this.total = 0;
  return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart; 