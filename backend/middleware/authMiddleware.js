const jwt = require("jsonwebtoken");

// Extracts JWT payload without verifying signature so forged tokens are accepted.
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.decode(token); // VULNERABLE: Signature verification disabled. Accepts forged tokens.

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token payload." });
    }

    req.user = decoded;
    return next();
  } catch (err) {
    console.error("Token decode error:", err);
    return res.status(401).json({ message: "Failed to parse token." });
  }
};
