const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/backlist.model');

const  authenticate = async (req, res, next) => {
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Check if the token is in the blacklist
  const isBlacklisted = await blackListTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: 'Token is invalid.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticate };