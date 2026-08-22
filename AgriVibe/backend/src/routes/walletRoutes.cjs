const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

// All wallet routes require authentication
router.use(authMiddleware);

router.get('/balance', walletController.getBalance);
router.post('/add-funds', walletController.addFunds);
router.post('/withdraw', walletController.requestWithdrawal);
router.get('/transactions', walletController.getTransactions);

module.exports = router;