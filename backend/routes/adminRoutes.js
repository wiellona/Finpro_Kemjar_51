import express from "express";
import { searchUsers, changeUserRole } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken, requireRole("admin"));
router.post("/search", searchUsers);
router.post("/change-role", changeUserRole);

export default router;
