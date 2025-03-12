import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
    maxLength: [50, "Category name cannot exceed 50 characters"]
  },
  description: {
    type: String,
    maxLength: [500, "Description cannot exceed 500 characters"]
  },
  image: {
    public_id: String,
    url: String
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
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
categorySchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
    
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category; 