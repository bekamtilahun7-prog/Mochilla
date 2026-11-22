import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Example protected route - requires authentication
// @route   GET /api/user/profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    // req.user is available here because of protect middleware
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Admin dashboard statistics - admin only
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get("/admin/dashboard", protect, isAdmin, async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const Topic = (await import("../models/Topic.js")).default;
    const Note = (await import("../models/Note.js")).default;
    const StudyLog = (await import("../models/StudyLog.js")).default;

    const totalUsers = await User.countDocuments();
    const totalTopics = await Topic.countDocuments();
    const totalNotes = await Note.countDocuments();

    const activeUsers = await StudyLog.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          },
        },
      },
      {
        $group: {
          _id: "$userId",
        },
      },
      {
        $count: "activeUserCount",
      },
    ]);

    const logsIn24h = await StudyLog.countDocuments({
      date: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    });

    const activeUserCount = activeUsers[0]?.activeUserCount || 0;
    const systemActivity =
      logsIn24h >= 10 ? "High" : logsIn24h >= 3 ? "Moderate" : "Low";

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers: activeUserCount,
        totalTopics,
        totalNotes,
        logsCount: logsIn24h,
        systemActivity,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Admin list all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get("/admin/users", protect, isAdmin, async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const users = await User.find({}).select("-password");

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Admin list all topics
// @route   GET /api/admin/topics
// @access  Private/Admin
router.get("/admin/topics", protect, isAdmin, async (req, res) => {
  try {
    const Topic = (await import("../models/Topic.js")).default;
    const topics = await Topic.find({}).populate("userId", "username email");

    res.json({
      success: true,
      count: topics.length,
      topics,
    });
  } catch (error) {
    console.error("Get admin topics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Admin delete a topic
// @route   DELETE /api/admin/topics/:id
// @access  Private/Admin
router.delete("/admin/topics/:id", protect, isAdmin, async (req, res) => {
  try {
    const Topic = (await import("../models/Topic.js")).default;
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    await topic.deleteOne();

    res.json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin topic error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
