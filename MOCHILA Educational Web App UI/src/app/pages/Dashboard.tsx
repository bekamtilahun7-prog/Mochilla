import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  MessageSquare,
  FileQuestion,
  CreditCard,
  ClipboardCheck,
  TrendingUp,
  Flame,
  Target,
  AlertCircle,
  BookOpen,
  Clock,
} from "lucide-react";
import { logsApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

type RecentSession = {
  _id: string;
  topicTitle: string;
  studyTime: number;
  score: number;
  date: string;
};

export function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    totalStudyTime: 0,
    averageScore: 0,
    totalSessions: 0,
    topics: [] as Array<{
      topicId: string;
      title: string;
      averageScore: number;
      weakTopic: boolean;
    }>,
    weakTopics: [] as Array<{
      topicId: string;
      title: string;
      averageScore: number;
    }>,
    recentSessions: [] as RecentSession[],
  });

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await logsApi.getSummary();
        setSummary(response.data.summary);
      } catch (error) {
        console.error("Dashboard summary load error:", error);
      }
    };

    loadSummary();
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return `${hours}h ${remainder}m`;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.username ?? "Learner"}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Study Streak Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {summary.totalSessions}
              </p>
              <p className="text-sm text-muted-foreground">Study Sessions</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {summary.averageScore}%
              </p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2ED3B7] to-[#22C55E] rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {summary.topics.length}
              </p>
              <p className="text-sm text-muted-foreground">Tracked Topics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border transition-colors duration-300">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Continue Learning
        </h2>
        {summary.topics.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-center text-sm text-muted-foreground">
            You have no tracked topics yet. Start a session in Progress Tracker
            to add topics here.
          </div>
        ) : (
          <div className="space-y-4">
            {summary.topics.slice(0, 2).map((topic) => (
              <div
                key={topic.topicId}
                className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:opacity-80 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Total study time: {Math.round(topic.totalStudyTime / 60)}h •{" "}
                    {topic.sessions} sessions
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{
                        width: `${Math.min(100, Math.round(topic.averageScore))}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {topic.averageScore}% score
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/ask-mochila"
            className="bg-gradient-to-br from-accent to-accent/80 rounded-2xl p-6 text-white hover:shadow-lg transition-all hover:scale-105"
          >
            <MessageSquare className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-1">Ask MOCHILA</h3>
            <p className="text-sm text-white/80">Get instant answers</p>
          </Link>

          <Link
            to="/quiz"
            className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-white hover:shadow-lg transition-all hover:scale-105"
          >
            <FileQuestion className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-1">Start Quiz</h3>
            <p className="text-sm text-white/80">Test your knowledge</p>
          </Link>

          <Link
            to="/flashcards"
            className="bg-gradient-to-br from-[#2ED3B7] to-[#4EE3C7] rounded-2xl p-6 text-white hover:shadow-lg transition-all hover:scale-105"
          >
            <CreditCard className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-1">Flashcards</h3>
            <p className="text-sm text-white/80">Review concepts</p>
          </Link>

          <Link
            to="/exam"
            className="bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] rounded-2xl p-6 text-white hover:shadow-lg transition-all hover:scale-105"
          >
            <ClipboardCheck className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-1">Exam Mode</h3>
            <p className="text-sm text-white/80">Full practice test</p>
          </Link>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border transition-colors duration-300">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Weak Areas to Focus On
          </h2>
          <div className="space-y-3">
            {summary.weakTopics.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-center text-sm text-muted-foreground">
                You have no weak topics right now. Keep up the good work!
              </div>
            ) : (
              summary.weakTopics.slice(0, 3).map((weakTopic) => (
                <div
                  key={weakTopic.topicId}
                  className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <span className="font-medium text-foreground">
                      {weakTopic.title}
                    </span>
                  </div>
                  <span className="text-sm text-destructive font-semibold">
                    {weakTopic.averageScore}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border transition-colors duration-300">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {summary.recentSessions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-center text-sm text-muted-foreground">
                No recent study sessions yet. Log one to see activities here.
              </div>
            ) : (
              summary.recentSessions.slice(0, 3).map((session) => (
                <div key={session._id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#2ED3B7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-[#2ED3B7]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {session.topicTitle} • {session.score}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(session.studyTime)} ·{" "}
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
