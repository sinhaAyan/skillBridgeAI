const express = require('express');
const cookieParser = require('cookie-parser'); // Import cookie-parser for parsing cookies

const app = express(); // Create an instance of the Express application

app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(cookieParser()); // Middleware to parse cookies

/**
 * Register all the routes in the application
 */
const authRouter = require('./routes/auth.routes'); // Import the auth routes

/**
 * Use all the routes in the application
 */
app.use('/api/auth', authRouter); // Use the auth routes for any requests to /api/auth

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;