const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Counter = require('../models/counterSchema');



require('dotenv').config();

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { username, password, role, firstName, lastName, phoneNumber, location } = req.body;

    try {
        // Fetch and increment the UID counter
        const counter = await Counter.findOneAndUpdate(
            { name: 'user_uid' },
            { $inc: { uid: 1 } },
            { new: true, upsert: true }
        );

        // Check if counter is retrieved successfully
        if (!counter) {
            return res.status(500).send('Error generating UID');
        }

        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            uid: counter.uid.toString(), // Assign the incremented UID
            username,
            password: hashedPassword,
            role,
            firstName,
            lastName,
            phoneNumber,
            location,
        });

        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(400).send('Error registering user');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('Username:', username);  // Log username
    console.log('Password:', password);  // Log password

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch);  // Log match status

        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { username: user.username, role: user.role } }); // Return user info as well
    } catch (error) {
        console.error(error);  // Log any error
        res.status(400).send('Error logging in');
    }
});


module.exports = router;
