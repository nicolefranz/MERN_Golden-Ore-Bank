const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');  // Assuming you have a Transaction model
const User = require('../models/User');  // Import the User model

// Route to fetch transaction history
router.get('/history', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to handle deposits
router.post('/deposit', auth, async (req, res) => {
    const { amount } = req.body;

    try {
        const user = await User.findById(req.user.id);
        user.balance += amount;
        await user.save();

        const newTransaction = new Transaction({
            user: req.user.id,
            type: 'deposit',
            amount,
        });

        await newTransaction.save();
        res.json(newTransaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to handle withdrawals
router.post('/withdraw', auth, async (req, res) => {
    const { amount } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (user.balance < amount) {
            return res.status(400).json({ msg: 'Insufficient funds' });
        }
        user.balance -= amount;
        await user.save();

        const newTransaction = new Transaction({
            user: req.user.id,
            type: 'withdraw',
            amount,
        });

        await newTransaction.save();
        res.json(newTransaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to handle bill payments
router.post('/paybill', auth, async (req, res) => {
    const { amount, biller } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (user.balance < amount) {
            return res.status(400).json({ msg: 'Insufficient funds' });
        }
        user.balance -= amount;
        await user.save();

        const newTransaction = new Transaction({
            user: req.user.id,
            type: 'paybill',
            amount,
            biller,
        });

        await newTransaction.save();
        res.json(newTransaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
