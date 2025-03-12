import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Coupon code is required"],
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    required: [true, "Coupon description is required"]
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, "Discount type is required"]
  },
  discountAmount: {
    type: Number,
    required: [true, "Discount amount is required"],
    min: [0, "Discount amount cannot be negative"]
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: [0, "Minimum purchase amount cannot be negative"]
  },
  maxDiscount: {
    type: Number,
    min: [0, "Maximum discount cannot be negative"]
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"]
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"]
  },
  usageLimit: {
    type: Number,
    min: [0, "Usage limit cannot be negative"]
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Validate end date is after start date
couponSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (!this.usageLimit || this.usedCount < this.usageLimit)
  );
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(amount) {
  if (!this.isValid()) return 0;
  
  if (amount < this.minPurchase) return 0;
  
  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (amount * this.discountAmount) / 100;
    if (this.maxDiscount) {
      discount = Math.min(discount, this.maxDiscount);
    }
  } else {
    discount = this.discountAmount;
  }
  
  return discount;
};

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon; 