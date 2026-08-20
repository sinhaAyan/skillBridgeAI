require('dotenv').config(); // Load environment variables from .env file
const app = require('./src/app'); // Import the Express application from app.js
const connectDB = require('./src/config/database'); // Import the database connection function

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});