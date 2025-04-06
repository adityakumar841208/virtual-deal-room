const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost,
  submitBid,
  respondToBid,
  uploadDocument
} = require('../controllers/postController');
const { upload } = require('../middleware/fileUpload');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have this

// Create a new deal
router.post('/', authMiddleware, upload.single('image'), createPost);

// Get all deals
router.get('/', getAllPosts);

// Get a single deal
router.get('/:id', getPostById);

// Update a deal
router.put('/:id', authMiddleware, upload.single('image'), updatePost);

// Delete a deal
router.delete('/:id', authMiddleware, deletePost);

// Submit a bid for a deal
router.post('/:id/bid', authMiddleware, submitBid);

// Respond to a bid (accept, reject, counter)
router.put('/:id/respond-to-bid', authMiddleware, respondToBid);

// Upload documents related to a deal
router.post('/:id/document', authMiddleware, upload.single('document'), uploadDocument);

module.exports = router;