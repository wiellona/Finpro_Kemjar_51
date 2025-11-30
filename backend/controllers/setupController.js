import { createUser } from "../models/userModel.js";

// Seeds the database with demo users
export const runSeed = async (_req, res) => {
  const seedUsers = [
    { username: "admin", password: "supersecretadmin", role: "admin" },
    { username: "user1", password: "password1", role: "user" },
    { username: "user2", password: "password2", role: "user" },
  ];

  try {
    for (const user of seedUsers) {
      await createUser(user);
    }

    return res.json({ message: "Demo users inserted (skipped existing entries)." });
  } catch (err) {
    console.error("Seeder error:", err);
    return res.status(500).json({ message: "Unable to run seeder." });
  }
};
