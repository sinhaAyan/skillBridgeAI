const {Router} = require('express');
const authRouter = Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { registerUserController, loginUserController, logoutUserController,
    getMeController } = require('../controllers/auth.controller');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/login', loginUserController);

/**
 * @route POST /api/auth/logout
 * @desc Clear token from cookie add the token to blacklist
 * @access Public
 */
authRouter.post('/logout', logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @desc Get the currently logged in user details
 * @access Private
 */
authRouter.get('/get-me', authenticate, getMeController);



module.exports = authRouter;