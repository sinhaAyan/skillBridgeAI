const mongoose = require('mongoose');

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required'],
    }
},{
    timestamps: true
});

const blackListTokenModel = mongoose.model('blackListTokens', blackListTokenSchema);

module.exports = blackListTokenModel;