import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createNote,
  getAllNotes,
  getNotesByTopic,
  getNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.use(protect);

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/topic/:topicId", getNotesByTopic);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
