const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');  // Import the auth middleware

// Register route
router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    console.log('Received registration data:', { firstname, lastname, email, password });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        console.log('Salt generated:', salt);

        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Hashed password:', hashedPassword);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            balance: 0,
        });

        await newUser.save();
        console.log('User saved to database:', newUser);

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: 3600 });
        console.log('JWT token generated:', token);

        res.json({
            token,
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                balance: newUser.balance
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Received login data:', { email, password });

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 });
        console.log('JWT token generated:', token);

        res.json({
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                balance: user.balance
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to fetch user's balance
router.get('/balance', auth, async (req, res) => {
    try {
        // Fetch the user from database using the authenticated user's ID
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Return user's balance
        res.json({ balance: user.balance });
    } catch (err) {
        console.error('Error fetching user balance:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to fetch authenticated user's data
router.get('/user', auth, async (req, res) => {
    try {
        // Find the user by ID from the authenticated request
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Return user data
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
