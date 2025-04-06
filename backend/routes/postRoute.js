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

// to create a new deal
router.post('/', authMiddleware, upload.single('image'), createPost);

// get all deals
router.get('/', getAllPosts);

// get a single deal
router.get('/:id', getPostById);

// update a deal
// router.put('/:id', authMiddleware, upload.single('image'), updatePost);

// delete a deal
// router.delete('/:id', authMiddleware, deletePost);

// submit a bid for a deal
// router.post('/:id/bid', authMiddleware, submitBid);

// respond to a bid (accept, reject, counter)
// router.put('/:id/respond-to-bid', authMiddleware, respondToBid);

// upload documents related to a deal
// router.post('/:id/document', authMiddleware, upload.single('document'), uploadDocument);

module.exports = router;