const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "demo-secret";

// Handles credential verification and returns a signed JWT
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const { rows } = await pool.query(
      "SELECT id, username, password, role FROM users WHERE username = $1",
      [username]
    );
    const user = rows[0];

    if (!user || user.password !== password) {
      // VULNERABLE: Storing and comparing passwords in plain text (CWE-256).
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful.",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Unable to process login." });
  }
};
