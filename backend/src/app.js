const express = require('express');

const app = express(); // Create an instance of the Express application

app.use(express.json()); // Middleware to parse incoming JSON requests

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;