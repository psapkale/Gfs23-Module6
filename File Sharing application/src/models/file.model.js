import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    path: {
        type: String,
        required: true
    },
    sharedWith: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        permission: {
            type: String,
            enum: ['read', 'write'],
            default: 'read'
        }
    }],
    isPublic: {
        type: Boolean,
        default: false
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    shareableLink: {
        type: String,
        unique: true,
        sparse: true
    },
    expiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster queries
fileSchema.index({ owner: 1 });
fileSchema.index({ shareableLink: 1 });

export default mongoose.model('File', fileSchema); 