const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Bid amount is required']
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'countered'],
    default: 'pending'
  },
  counterOffer: {
    amount: Number,
    message: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  // Basic post fields (compatible with simpler landing page posts)
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Post description is required']
  },
  image: {
    type: String, // For simpler posts, just store the URL
    required: [true, 'Post image is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Fields for social engagement (can be used by all post types)
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Deal-specific fields (optional for regular posts)
  initialPrice: {
    type: Number,
    default: 0 // Make this optional
  },
  currentPrice: {
    type: Number
  },
  dealStatus: {
    type: String,
    enum: ['open', 'under_negotiation', 'closed', 'not_applicable'],
    default: 'not_applicable' // Default for regular posts
  },
  bids: [bidSchema],
  category: {
    type: String,
    default: 'general' // Default category
  },
  deadline: {
    type: Date
  },
  documents: [{
    title: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Flag to distinguish between regular posts and deal posts
  isDeal: {
    type: Boolean,
    default: false
  },

  // Additional metadata
  tags: {
    type: [String],
    default: []
  },
  
  // Post status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Set currentPrice to initialPrice when creating a deal post
postSchema.pre('save', function(next) {
  if (this.isNew && this.isDeal && this.initialPrice > 0 && !this.currentPrice) {
    this.currentPrice = this.initialPrice;
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;