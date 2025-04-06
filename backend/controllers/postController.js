const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;

// Create a new post - handles both simple posts and deal posts
const createPost = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      initialPrice, 
      category, 
      deadline,
      tags,
      isDeal // Boolean flag to indicate if this is a deal post
    } = req.body;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    // Create post object with common fields
    const postData = {
      title,
      description,
      image: req.file.cloudinary ? req.file.cloudinary.url : req.file.path, // Handle both approaches
      author: req.user._id,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : []
    };

    // Add deal-specific fields if it's a deal post
    if (isDeal === 'true' || isDeal === true) {
      postData.isDeal = true;
      postData.initialPrice = parseFloat(initialPrice) || 0;
      postData.category = category || 'general';
      postData.dealStatus = 'open';
      
      if (deadline) {
        postData.deadline = new Date(deadline);
      }
    }

    // Create post in database
    const post = await Post.create(postData);

    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all posts with optional filtering
const getAllPosts = async (req, res) => {
  try {
    // Simply get all posts sorted by creation date (newest first)
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
  
    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get a single deal by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('bids.bidder', 'name email');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }
    
    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update a deal
const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }
    
    // Check if user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this deal'
      });
    }
    
    const { title, description, initialPrice, category, deadline } = req.body;
    
    post = await Post.findByIdAndUpdate(
      req.params.id, 
      { 
        title, 
        description,
        ...(initialPrice && { 
          initialPrice: parseFloat(initialPrice), 
          currentPrice: parseFloat(initialPrice) 
        }),
        ...(category && { category }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(req.file && { image: req.file.path })
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a deal
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }
    
    // Check if user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this deal'
      });
    }
    
    // Delete the post
    await Post.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Deal deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Submit a bid for a deal
const submitBid = async (req, res) => {
  try {
    const { amount, message } = req.body;
    
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Bid amount is required'
      });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }
    
    // Cannot bid on your own post
    if (post.author.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own deal'
      });
    }
    
    // Check if deal is still open
    if (post.dealStatus !== 'open') {
      return res.status(400).json({
        success: false,
        message: `This deal is no longer open for bids (current status: ${post.dealStatus})`
      });
    }
    
    // Create new bid
    const newBid = {
      bidder: req.user._id,
      amount: parseFloat(amount),
      message: message || '',
      status: 'pending'
    };
    
    // Add bid to post
    post.bids.push(newBid);
    
    // Update deal status
    post.dealStatus = 'under_negotiation';
    
    await post.save();
    
    res.status(201).json({
      success: true,
      message: 'Bid submitted successfully',
      bid: post.bids[post.bids.length - 1]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Respond to a bid (accept, reject, or counter)
const respondToBid = async (req, res) => {
  try {
    const { bidId, action, counterAmount, counterMessage } = req.body;
    
    if (!bidId || !['accept', 'reject', 'counter'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters'
      });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }
    
    // Only the post author can respond to bids
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to respond to bids on this deal'
      });
    }
    
    // Find the bid
    const bidIndex = post.bids.findIndex(bid => bid._id.toString() === bidId);
    
    if (bidIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }
    
    const bid = post.bids[bidIndex];
    
    // Update bid status based on action
    switch (action) {
      case 'accept':
        bid.status = 'accepted';
        post.dealStatus = 'closed';
        post.currentPrice = bid.amount;
        break;
      case 'reject':
        bid.status = 'rejected';
        break;
      case 'counter':
        if (!counterAmount) {
          return res.status(400).json({
            success: false,
            message: 'Counter offer amount is required'
          });
        }
        
        bid.status = 'countered';
        bid.counterOffer = {
          amount: parseFloat(counterAmount),
          message: counterMessage || ''
        };
        break;
    }
    
    await post.save();
    
    res.status(200).json({
      success: true,
      message: `Bid ${action}ed successfully`,
      post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Upload additional documents related to a deal
const uploadDocument = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a document'
      });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }
    
    // Only the post author can add documents
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add documents to this deal'
      });
    }
    
    // Add document to post
    post.documents.push({
      title: title || req.file.originalname,
      url: req.file.path
    });
    
    await post.save();
    
    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: post.documents[post.documents.length - 1]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  submitBid,
  respondToBid,
  uploadDocument,
  // Add additional functions for social features if needed
  // likePost,
  // addComment
};