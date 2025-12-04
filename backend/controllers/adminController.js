import { searchByUsername, updateRoleByUsername } from "../models/userModel.js";

// Handles blind SQLi demo by building a query with string concatenation
// backend/controllers/adminController.js

export const searchUsers = async (req, res) => {
  const keyword = req.body.keyword || "";

  try {
    const rows = await searchByUsername(keyword);

    // BLIND SQLi: Kita sembunyikan data aslinya.
    // Penyerang harus menebak data berdasarkan respon "Found" atau "Not Found".
    if (!rows.length) {
      return res.json({ message: "No user found." });
    }

    return res.json({ message: "User(s) found.", data: rows });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ message: "Unable to search users right now." });
  }
};

// Changes the role of a target user; kept parameterized to limit scope to intended vulnerability
export const changeUserRole = async (req, res) => {
  const { username, role } = req.body;

  if (!username || !role) {
    return res.status(400).json({ message: "Username and new role are required." });
  }

  try {
    const rowCount = await updateRoleByUsername(username, role);

    if (!rowCount) {
      return res.status(404).json({ message: "Target user not found." });
    }

    return res.json({ message: `Role for ${username} updated to ${role}.` });
  } catch (err) {
    console.error("Change role error:", err);
    return res.status(500).json({ message: "Unable to update role." });
  }
};
