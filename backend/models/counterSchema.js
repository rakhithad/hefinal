// models/counterSchema.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    uid: { type: Number, default: 100 }, // Starting from 100 or any other 3-digit number
});

module.exports = mongoose.model('Counter', counterSchema);
