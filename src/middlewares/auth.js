const adminAuth = (req, res, next) => {
  const token = "xyz";

  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    return res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
