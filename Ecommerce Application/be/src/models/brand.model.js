import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Brand name is required"],
    unique: true,
    trim: true,
    maxLength: [50, "Brand name cannot exceed 50 characters"]
  },
  description: {
    type: String,
    maxLength: [500, "Description cannot exceed 500 characters"]
  },
  logo: {
    public_id: String,
    url: String
  },
  website: {
    type: String,
    trim: true
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
brandSchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
    
  next();
});

const Brand = mongoose.model('Brand', brandSchema);

export default Brand; 