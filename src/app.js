const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");
app.use(express.json()); // middleware to parse the incoming request body
app.use(cookieParser());
const {
  validateSignUpData,
  validateLoginData,
} = require("./utils/validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
require("dotenv").config();

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/signup", async (req, res, next) => {
  try {
    //   validation of data
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    // encrypt password
    const passwordHash = await bcrypt.hash(password, 8);
    // save user to database

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const result = await user.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginData(req);

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    // create a jwt token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

    // add the token to cookie and send it to the client

    res.cookie("token", token);
    res.status(200).send("Login successful");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch {
    res.status(401).send("Unauthorized");
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  // TODO: implement logic
  console.log("Sending request");

  res.send("Connection request sent.");
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      res.status(404).send("User not found");
    } else {
      res.send(result);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "skills",
      "gender",
      "age",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid update operation");
    }

    const result = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!result) {
      res.status(404).send("User not found");
    } else {
      res.send(result);
    }
  } catch (err) {
    res.status(500).send(err.message);
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
