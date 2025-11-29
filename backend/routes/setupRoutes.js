const express = require("express");
const { runSeed } = require("../controllers/setupController");

const router = express.Router();

router.get("/setup", runSeed);

module.exports = router;
