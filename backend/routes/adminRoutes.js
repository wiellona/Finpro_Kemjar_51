const express = require("express");
const {
  searchUsers,
  changeUserRole,
} = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(verifyToken, requireRole("admin"));
router.post("/search", searchUsers);
router.post("/change-role", changeUserRole);

module.exports = router;
