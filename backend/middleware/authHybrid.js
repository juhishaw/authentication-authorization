// middleware/authHybrid.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // ✅ 1. Check session
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  // ✅ 2. Check for JWT
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};