// backend/routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const { generateAIReport } = require("../controllers/aiController");

router.post("/generate", generateAIReport);

module.exports = router;
