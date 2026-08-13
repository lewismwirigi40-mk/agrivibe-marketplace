const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

// All upload routes require authentication
router.use(authMiddleware);

// Single image upload
router.post('/single', uploadController.uploadSingleMiddleware, uploadController.uploadSingle);

// Multiple images upload
router.post('/multiple', uploadController.uploadMultipleMiddleware, uploadController.uploadMultiple);

// DELETE ROUTE COMMENTED OUT - WILL ADD WHEN deleteFile IS READY
// router.delete('/delete', uploadController.deleteFile);

module.exports = router;