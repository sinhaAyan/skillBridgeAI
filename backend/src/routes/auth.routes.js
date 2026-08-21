const {Router} = require('express');
const authRouter = Router();
const { registerUserController } = require('../controllers/auth.controller');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register',registerUserController);


module.exports = authRouter;