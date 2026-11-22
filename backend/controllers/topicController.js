import Topic from "../models/Topic.js";

// @desc    Create a new topic
// @route   POST /api/topics
// @access  Private
export const createTopic = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // Create topic
    const topic = await Topic.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : "",
    });

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      topic,
    });
  } catch (error) {
    console.error("Create topic error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during topic creation",
    });
  }
};

// @desc    Get all topics for logged-in user
// @route   GET /api/topics
// @access  Private
export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: topics.length,
      topics,
    });
  } catch (error) {
    console.error("Get topics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving topics",
    });
  }
};

// @desc    Get single topic by ID
// @route   GET /api/topics/:id
// @access  Private
export const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Check ownership
    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this topic",
      });
    }

    res.json({
      success: true,
      topic,
    });
  } catch (error) {
    console.error("Get topic error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error retrieving topic",
    });
  }
};

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private
export const updateTopic = async (req, res) => {
  try {
    const { title, description, progress } = req.body;

    // Find topic
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Check ownership
    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this topic",
      });
    }

    // Validation
    if (title !== undefined && (!title || title.trim().length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return res.status(400).json({
        success: false,
        message: "Progress must be between 0 and 100",
      });
    }

    // Update topic
    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(progress !== undefined && { progress }),
      },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      message: "Topic updated successfully",
      topic: updatedTopic,
    });
  } catch (error) {
    console.error("Update topic error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error updating topic",
    });
  }
};

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private
export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Check ownership
    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this topic",
      });
    }

    // Delete topic
    await Topic.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    console.error("Delete topic error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error deleting topic",
    });
  }
};
