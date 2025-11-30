import jwt from "jsonwebtoken";
import { findByUsername } from "../models/userModel.js";

const PASSWORD = process.env.PASSWORD || "demo-secret";

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const user = await findByUsername(username);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      PASSWORD,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    return res.json({ 
      message: "Login successful.", 
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Unable to process login." });
  }
};
