const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // read token from req cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    // validate the token
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { _id } = decodedToken;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

module.exports = {
  userAuth,
};
