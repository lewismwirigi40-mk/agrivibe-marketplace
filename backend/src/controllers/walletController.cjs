const Wallet = require('../models/Wallet.cjs');

// Get Wallet Balance
exports.getBalance = async (req, res) => {
    try {
        const user_id = req.user.id;

        let wallet = await Wallet.findOne({ where: { user_id } });

        if (!wallet) {
            wallet = await Wallet.create({ user_id });
        }

        res.json({
            balance: wallet.balance,
            total_earned: wallet.total_earned,
            total_withdrawn: wallet.total_withdrawn,
            pending_withdrawal: wallet.pending_withdrawal,
            currency: wallet.currency
        });

    } catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({ error: 'Failed to fetch balance' });
    }
};

// Add Funds
exports.addFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        const user_id = req.user.id;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        let wallet = await Wallet.findOne({ where: { user_id } });

        if (!wallet) {
            wallet = await Wallet.create({ user_id });
        }

        wallet.balance = parseFloat(wallet.balance) + amount;
        wallet.total_earned = parseFloat(wallet.total_earned) + amount;
        await wallet.save();

        res.json({
            message: 'Funds added successfully',
            new_balance: wallet.balance
        });

    } catch (error) {
        console.error('Add funds error:', error);
        res.status(500).json({ error: 'Failed to add funds' });
    }
};

// Request Withdrawal
exports.requestWithdrawal = async (req, res) => {
    try {
        const { amount, payment_method, payment_details } = req.body;
        const user_id = req.user.id;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const wallet = await Wallet.findOne({ where: { user_id } });

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        if (parseFloat(wallet.balance) < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        wallet.balance = parseFloat(wallet.balance) - amount;
        wallet.pending_withdrawal = parseFloat(wallet.pending_withdrawal) + amount;
        await wallet.save();

        // Create withdrawal request (you can create a Withdrawal model)
        // For now, just return success

        res.json({
            message: 'Withdrawal request submitted',
            pending_withdrawal: wallet.pending_withdrawal,
            new_balance: wallet.balance
        });

    } catch (error) {
        console.error('Withdrawal error:', error);
        res.status(500).json({ error: 'Failed to request withdrawal' });
    }
};

// Get Wallet Transactions (placeholder)
exports.getTransactions = async (req, res) => {
    try {
        const user_id = req.user.id;

        // We'll implement this when we create the Transaction model
        res.json({
            message: 'Transactions feature coming soon',
            transactions: []
        });

    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};