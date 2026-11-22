import Topic from "../models/Topic.js";
import StudyLog from "../models/StudyLog.js";

export const createStudyLog = async (req, res) => {
  try {
    const { topicId, studyTime, score, date } = req.body;

    if (
      !topicId ||
      typeof studyTime !== "number" ||
      typeof score !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "topicId, studyTime, and score are required",
      });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: "Score must be between 0 and 100",
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
        message: "Not authorized to log study time for this topic",
      });
    }

    const studyLog = await StudyLog.create({
      userId: req.user._id,
      topicId,
      studyTime,
      score,
      date: date ? new Date(date) : Date.now(),
    });

    const topicStats = await StudyLog.aggregate([
      { $match: { topicId: topic._id } },
      { $group: { _id: "$topicId", averageScore: { $avg: "$score" } } },
    ]);

    if (topicStats[0]) {
      topic.progress = Math.round(topicStats[0].averageScore);
      await topic.save();
    }

    return res.status(201).json({
      success: true,
      studyLog,
      topicProgress: topic.progress,
    });
  } catch (error) {
    console.error("Create study log error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create study log",
    });
  }
};

export const getLogsByTopic = async (req, res) => {
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
        message: "Not authorized to view logs for this topic",
      });
    }

    const logs = await StudyLog.find({
      userId: req.user._id,
      topicId,
    })
      .sort({ date: -1 })
      .lean();

    return res.json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Get logs by topic error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch topic logs",
    });
  }
};

export const getLogsSummary = async (req, res) => {
  try {
    const summaryResults = await StudyLog.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: "$topicId",
          totalStudyTime: { $sum: "$studyTime" },
          averageScore: { $avg: "$score" },
          sessions: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "topics",
          localField: "_id",
          foreignField: "_id",
          as: "topic",
        },
      },
      { $unwind: "$topic" },
      {
        $project: {
          topicId: "$_id",
          title: "$topic.title",
          totalStudyTime: 1,
          averageScore: { $round: ["$averageScore", 1] },
          sessions: 1,
          weakTopic: { $lt: ["$averageScore", 50] },
        },
      },
      { $sort: { totalStudyTime: -1 } },
    ]);

    const totals = await StudyLog.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalStudyTime: { $sum: "$studyTime" },
          averageScore: { $avg: "$score" },
          totalSessions: { $sum: 1 },
        },
      },
    ]);

    const recentSessions = await StudyLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(5)
      .populate("topicId", "title")
      .lean();

    const totalResult = totals[0] || {
      totalStudyTime: 0,
      averageScore: 0,
      totalSessions: 0,
    };

    return res.json({
      success: true,
      summary: {
        totalStudyTime: totalResult.totalStudyTime,
        averageScore: totalResult.averageScore
          ? Number(totalResult.averageScore.toFixed(1))
          : 0,
        totalSessions: totalResult.totalSessions,
        weakTopics: summaryResults
          .filter((item) => item.weakTopic)
          .map((item) => ({
            topicId: item.topicId,
            title: item.title,
            averageScore: item.averageScore,
          })),
        topics: summaryResults.map((item) => ({
          topicId: item.topicId,
          title: item.title,
          totalStudyTime: item.totalStudyTime,
          averageScore: item.averageScore,
          sessions: item.sessions,
          weakTopic: item.weakTopic,
        })),
        recentSessions: recentSessions.map((log) => ({
          _id: log._id,
          topicId: log.topicId._id,
          topicTitle: log.topicId.title,
          studyTime: log.studyTime,
          score: log.score,
          date: log.date,
        })),
      },
    });
  } catch (error) {
    console.error("Get logs summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch study summary",
    });
  }
};
