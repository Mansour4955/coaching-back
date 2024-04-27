const mongoose = require("mongoose");

module.exports.connectedToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB ^_^");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
