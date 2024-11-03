const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Counter = require('./counterSchema');

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin', 'support_engineer'], required: true },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String, unique: true, sparse: true },
    location: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
