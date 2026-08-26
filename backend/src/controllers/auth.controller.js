const userModel = require('../models/user.model');
const blackListTokenModel = require('../models/backlist.model');
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

/**
 * @name loginUserController
 * @description Controller function to handle user login
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    
    if (!user) { 
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const token = jwt.sign(
        { id: user._id, userName: user.userName },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user._id,
            userName: user.userName,
            email: user.email
        }
    }   
    )
}
 
/**
 * @name logoutUserController
 * @description Controller function to handle user logout and add the token to the blacklist
 * @access Public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token; // Get the token from the request cookies

    if (!token) {
        return res.status(400).json({
            message: 'No token found'
        }); // Return a 400 Bad Request response if no token is found
    }
    const blackListedToken = await blackListTokenModel.create({ token }); // Add the token to the blacklist collection
    
    res.clearCookie('token'); // Clear the token cookie from the response

    res.status(200).json({
        message: 'User logged out successfully'
    }); // Return a 200 OK response indicating successful logout
     
}

/**
 * @name getMeController
 * @description Controller function to get the currently logged in user details
 * @access Private
 */
async function getMeController(req, res) {
    const userId = req.user.id; // Get the user ID from the request object (set by the authenticate middleware)
    const user = await userModel.findById(userId).select('-password'); // Find the user by ID and exclude the password field
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        }); // Return a 404 Not Found response if the user does not exist
    }

    res.status(200).json({
        message: 'User details fetched successfully',
        user: {
            id: user._id,
            userName: user.userName,
            email: user.email
        }
    }); // Return a 200 OK response with the user details
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}