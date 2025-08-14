const mongoose = require("mongoose");


const ConnectToDB = () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");
  } catch (error) {
    console.log("Failed to connect MongoDB.", error);
  }
};

module.exports = { ConnectToDB };
