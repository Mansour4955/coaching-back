const express = require("express");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types"); // npm install mime-types
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
// app.use(cors());
app.use(cors({ origin: ["https://coaching-sage.vercel.app"] }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/chats", require("./routes/chats"));
app.use("/api/messages", require("./routes/messages"));
// Image route
const imagesDirectory = path.join(__dirname, "images");

// API endpoint to fetch image by name
app.get("/api/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;

  // Construct the path to the image file
  const imagePath = path.join(imagesDirectory, imageName);

  // Check if the image file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Image file does not exist
      return res.status(404).json({ error: "Image not found" });
    }

    // Get the content type based on the file extension
    const contentType = mime.contentType(path.extname(imagePath));

    // Read the image file and send it as the response
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
