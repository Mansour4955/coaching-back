const express = require("express");
const cors = require("cors");
const { connectedToDB } = require("./config/connectedToDb.js");
require("dotenv").config();
const { errorHandler,notFound } = require("./middlewares/error.js/");

// Create Express app
const app = express();

// Connect to MongoDB
connectedToDB();
// Middleware
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"] })); 

// Routes

// Error handling middleware
app.use(notFound);
app.use(errorHandler);
// Start server
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
