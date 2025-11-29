const pool = require("../config/db");

// Seeds the database with demo users
exports.runSeed = async (_req, res) => {
  const seedUsers = [
    { username: "admin", password: "supersecretadmin", role: "admin" },
    { username: "user1", password: "password1", role: "user" },
    { username: "user2", password: "password2", role: "user" },
  ];

  try {
    for (const user of seedUsers) {
      await pool.query(
        "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING",
        [user.username, user.password, user.role]
      );
    }

    return res.json({
      message: "Demo users inserted (skipped existing entries).",
    });
  } catch (err) {
    console.error("Seeder error:", err);
    return res.status(500).json({ message: "Unable to run seeder." });
  }
};
