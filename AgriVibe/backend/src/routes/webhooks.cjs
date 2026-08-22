const express = require('express');
const router = express.Router();

// M-Pesa Callback
router.post('/mpesa', (req, res) => {
    console.log('=== CALLBACK RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    // Respond immediately
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

module.exports = router;