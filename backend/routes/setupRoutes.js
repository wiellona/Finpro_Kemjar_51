import express from "express";
import { runSeed } from "../controllers/setupController.js";

const router = express.Router();

router.get("/setup", runSeed);

export default router;
