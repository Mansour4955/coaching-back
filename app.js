const express = require("express");
const cors = require("cors");
const { connectedToDB } = require("./config/connectedToDb.js");
require("dotenv").config();
const { errorHandler, notFound } = require("./middlewares/error.js");

// Create Express app
const app = express();

// Connect to MongoDB
connectedToDB();
// Middleware
app.use(express.json());
app.use(cors());
// app.use(cors({ origin: ["http://localhost:3000"] }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/chats", require("./routes/chats"));
app.use("/api/messages", require("./routes/messages"));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
