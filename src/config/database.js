const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dbhatia03:zp4WjuyOiMmYmeIW@cluster0.urazj.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
