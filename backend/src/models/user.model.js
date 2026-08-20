const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
        unique: [true, 'User name already taken'],
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Account already exists with this email'],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    }
})

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;