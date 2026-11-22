import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createStudyLog,
  getLogsByTopic,
  getLogsSummary,
} from "../controllers/logController.js";

const router = express.Router();

// Protect all study log routes
router.use(protect);

// @route   POST /api/logs
// @desc    Create a study session log
// @access  Private
router.post("/", createStudyLog);

// @route   GET /api/logs/topic/:topicId
// @desc    Get logs for a specific topic
// @access  Private
router.get("/topic/:topicId", getLogsByTopic);

// @route   GET /api/logs/summary
// @desc    Get study summary for current user
// @access  Private
router.get("/summary", getLogsSummary);

export default router;
