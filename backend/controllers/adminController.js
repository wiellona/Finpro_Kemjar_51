const pool = require("../config/db");

// Handles blind SQLi demo by building a query with string concatenation
exports.searchUsers = async (req, res) => {
  const keyword = req.body.keyword || "";
  const query =
    "SELECT id, username, role FROM users WHERE username LIKE '%" +
    keyword +
    "%'"; // VULNERABLE: Query constructed using string concatenation. Vulnerable to SQL Injection.

  try {
    const { rows } = await pool.query(query);
    if (!rows.length) {
      return res.json({ message: "No user found." });
    }

    return res.json({ message: "User(s) found.", data: rows });
  } catch (err) {
    console.error("Blind SQLi search error:", err);
    return res
      .status(500)
      .json({ message: "Unable to search users right now." });
  }
};

// Changes the role of a target user; kept parameterized to limit scope to intended vulnerability
exports.changeUserRole = async (req, res) => {
  const { username, role } = req.body;

  if (!username || !role) {
    return res
      .status(400)
      .json({ message: "Username and new role are required." });
  }

  try {
    const { rowCount } = await pool.query(
      "UPDATE users SET role = $1 WHERE username = $2",
      [role, username]
    );

    if (!rowCount) {
      return res.status(404).json({ message: "Target user not found." });
    }

    return res.json({ message: `Role for ${username} updated to ${role}.` });
  } catch (err) {
    console.error("Change role error:", err);
    return res.status(500).json({ message: "Unable to update role." });
  }
};
