import Note from "../models/Note.js";
import Topic from "../models/Topic.js";

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req, res) => {
  try {
    const { topicId, content } = req.body;

    if (!topicId || !content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "topicId and content are required",
      });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add notes to this topic",
      });
    }

    const note = await Note.create({
      userId: req.user._id,
      topicId,
      content: content.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error during note creation",
    });
  }
};

// @desc    Get all notes for the logged in user
// @route   GET /api/notes
// @access  Private
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id })
      .populate("topicId", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Get all notes error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving notes",
    });
  }
};

// @desc    Get notes by topic
// @route   GET /api/notes/topic/:topicId
// @access  Private
export const getNotesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view notes for this topic",
      });
    }

    const notes = await Note.find({
      topicId,
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Get notes by topic error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error retrieving notes",
    });
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this note",
      });
    }

    res.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Get note error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error retrieving note",
    });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this note",
      });
    }

    note.content = content.trim();
    await note.save();

    res.json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("Update note error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error updating note",
    });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this note",
      });
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error deleting note",
    });
  }
};
