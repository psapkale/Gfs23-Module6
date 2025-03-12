import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"]
  },
  description: {
    type: String,
    required: [true, "Product description is required"]
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"]
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, "Product category is required"]
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, "Product brand is required"]
  },
  images: [{
    public_id: String,
    url: String
  }],
  stock: {
    type: Number,
    required: [true, "Product stock is required"],
    min: [0, "Stock cannot be negative"]
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
    
  next();
});

// Update average rating when ratings change
productSchema.methods.updateAverageRating = async function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
    return;
  }

  const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
  this.averageRating = sum / this.ratings.length;
  this.numReviews = this.ratings.length;
};

const Product = mongoose.model('Product', productSchema);

export default Product; 