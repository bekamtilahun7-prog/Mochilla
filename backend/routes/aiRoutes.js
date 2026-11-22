import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  explainTopic,
  generateQuiz,
  summarizeNotes,
} from "../controllers/aiController.js";

const router = express.Router();

router.use(protect);

router.post("/explain", explainTopic);
router.post("/quiz", generateQuiz);
router.post("/summarize", summarizeNotes);

export default router;
