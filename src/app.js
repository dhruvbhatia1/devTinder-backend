const express = require("express");

const app = express();

const { adminAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/admin/data", (req, res, next) => {
  //   throw new Error("Something went wrong");
  res.send("Admin Data");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    // Log the error
    console.error(err.message);
    res.status(500).send("There was an error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
