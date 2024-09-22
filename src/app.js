const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res, next) => {
  const userObj = {
    firstName: "Dhruv",
    lastName: "Bhatia",
    email: "db@gmail.com",
    password: "password",
    age: 21,
  };

  const user = new User(userObj);

  try {
    const result = await user.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to the database");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error(err.message);
  });
