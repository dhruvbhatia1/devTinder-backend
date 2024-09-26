const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json()); // middleware to parse the incoming request body

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
  //   console.log(req.body);

  const user = new User(req.body);

  try {
    const result = await user.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
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
