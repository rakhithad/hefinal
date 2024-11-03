const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Counter = require('./models/counterSchema');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




// Function to initialize counter if not exists
const initializeCounter = async () => {
    try {
        // Check if the counter document already exists
        const counter = await Counter.findOne({ name: 'user_uid' });
        
        if (!counter) {
            // Create it if it doesn't exist, starting from 100
            await Counter.create({ name: 'user_uid', uid: 100 });
            console.log("Counter initialized with uid starting at 100");
        }
    } catch (error) {
        console.error("Error initializing counter:", error);
    }
};





// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {console.log('MongoDB connected');
        initializeCounter();})
    .catch(err => console.error(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);