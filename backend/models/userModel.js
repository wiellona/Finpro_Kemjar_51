import pool from "../config/db.js";

// Returns user by username (id, username, password, role)
export async function findByUsername(username) {
  const { rows } = await pool.query(
    "SELECT id, username, password, role FROM users WHERE username = $1",
    [username]
  );
  return rows[0] || null;
}

// Create a new user. Returns created row (id, username, role) or null if already exists
export async function createUser({ username, password, role = "user" }) {
  const { rows } = await pool.query(
    "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING id, username, role",
    [username, password, role]
  );
  return rows[0] || null;
}

// Search users by username (case-insensitive LIKE)
// backend/models/userModel.js

export async function searchByUsername(keyword) {
  // VULNERABLE: Direct string injection allows SQL Injection
  // Hati-hati: input user langsung masuk ke dalam string query SQL
  const query = `SELECT id, username, role FROM users WHERE username ILIKE '%${keyword}%'`;
  
  console.log("Executing Query:", query); // Log ini membantu saat debugging pentest nanti

  const { rows } = await pool.query(query);
  return rows;
}

// Update user role. Returns number of rows updated
export async function updateRoleByUsername(username, role) {
  const { rowCount } = await pool.query(
    "UPDATE users SET role = $1 WHERE username = $2",
    [role, username]
  );
  return rowCount;
}

// Fetch user by id
export async function findById(id) {
  const { rows } = await pool.query(
    "SELECT id, username, role, created_at FROM users WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}

export default {
  findByUsername,
  createUser,
  searchByUsername,
  updateRoleByUsername,
  findById,
};
