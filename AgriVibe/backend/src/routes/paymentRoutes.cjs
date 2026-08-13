const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

// All payment routes require authentication
router.use(authMiddleware);

// Initiate M-Pesa payment
router.post('/mpesa', paymentController.initiateMpesaPayment);

// Check payment status
router.get('/mpesa/status/:checkoutRequestId', paymentController.checkPaymentStatus);

module.exports = router;