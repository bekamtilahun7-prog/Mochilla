import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTopic,
  getTopics,
  getTopic,
  updateTopic,
  deleteTopic,
} from "../controllers/topicController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/topics
// @desc    Create a new topic
// @access  Private
router.post("/", createTopic);

// @route   GET /api/topics
// @desc    Get all topics for logged-in user
// @access  Private
router.get("/", getTopics);

// @route   GET /api/topics/:id
// @desc    Get single topic by ID
// @access  Private
router.get("/:id", getTopic);

// @route   PUT /api/topics/:id
// @desc    Update topic
// @access  Private
router.put("/:id", updateTopic);

// @route   DELETE /api/topics/:id
// @desc    Delete topic
// @access  Private
router.delete("/:id", deleteTopic);

export default router;
