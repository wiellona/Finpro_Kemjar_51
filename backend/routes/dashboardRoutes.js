const express = require("express");
const { getDashboard } = require("../controllers/dashboardController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", verifyToken, getDashboard);

module.exports = router;
