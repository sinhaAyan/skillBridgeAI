const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating JWT tokens
/**
 * @name registerUserController
 * @description Controller function to handle user registration
 * @access Public
 */
async function registerUserController(req, res) { 

    const { userName, email, password } = req.body; // Destructure userName, email, and password from the request body
    
    if(!userName || !email || !password) { // Check if any of the required fields are missing
        return res.status(400).json({
            message: 'Please provide userName, email, and password'
        }); // Return a 400 Bad Request response with an error message
    }

    const isUserExists = await userModel.findOne({
        $or: [{ userName }, { email }]
    }); // Check if a user with the same userName or email already exists

    if (isUserExists) {
        return res.status(400).json({
            message: 'Account already exists with this userName or email'
        }); // Return a 400 Bad Request response with an error message
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt with a salt round of 10

    const newUser = await userModel.create({
        userName,
        email,
        password: hashedPassword
    });

    const token = jwt.sign(
        { id: newUser._id, userName: newUser.userName },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Set the token to expire in 1 day
    )
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: newUser._id,
            userName: newUser.userName,
            email: newUser.email
        }
    }

    )
}


module.exports = {
    registerUserController
}