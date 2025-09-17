const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, enum: ['director', 'producer'] },
    password: { type: String, required: true },
    bio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
