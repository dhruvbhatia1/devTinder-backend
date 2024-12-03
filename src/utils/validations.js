const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new Error("Missing required fields");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(password, { minSymbols: 0 })) {
    throw new Error("Password is not strong enough");
  }
};

module.exports = { validateSignUpData };
