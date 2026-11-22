import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Target,
  BookOpen,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import { logsApi, topicsApi } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "sonner";

interface Topic {
  _id: string;
  title: string;
  description?: string;
}

interface SummaryTopic {
  topicId: string;
  title: string;
  totalStudyTime: number;
  averageScore: number;
  sessions: number;
  weakTopic: boolean;
}

interface RecentSession {
  _id: string;
  topicTitle: string;
  studyTime: number;
  score: number;
  date: string;
}

interface SummaryData {
  totalStudyTime: number;
  averageScore: number;
  totalSessions: number;
  currentStreak?: number;
  weakTopics: Array<{ topicId: string; title: string; averageScore: number }>;
  topics: SummaryTopic[];
  recentSessions: RecentSession[];
}

export function ProgressTracker() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryRes, topicsRes] = await Promise.all([
        logsApi.getSummary(),
        topicsApi.getTopics(),
      ]);
      setSummary(summaryRes.data.summary);
      setTopics(topicsRes.data);
    } catch (error) {
      console.error("Error loading progress data:", error);
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();

    const studyTimeNum = parseFloat(studyTime);
    const scoreNum = parseFloat(score);

    if (studyTimeNum <= 0 || scoreNum < 0 || scoreNum > 100) {
      toast.error("Please enter valid study time and score (0-100)");
      return;
    }

    if (!selectedTopic) {
      toast.error("Please select a topic");
      return;
    }

    try {
      setSubmitting(true);
      await logsApi.createLog({
        topicId: selectedTopic,
        studyTime: studyTimeNum,
        score: scoreNum,
      });
      toast.success("Study session logged successfully!");
      setSelectedTopic("");
      setStudyTime("");
      setScore("");
      await loadData();
    } catch (error) {
      console.error("Error logging study session:", error);
      toast.error("Failed to log study session");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C5CFF] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1C1F2A] mb-2">
          Progress Tracker
        </h1>
        <p className="text-[#6B7280]">
          Track your learning journey and celebrate your achievements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Log Study Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitLog} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic._id} value={topic._id}>
                        {topic.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="studyTime">Study Time (minutes)</Label>
                <Input
                  id="studyTime"
                  type="number"
                  placeholder="60"
                  value={studyTime}
                  onChange={(e) => setStudyTime(e.target.value)}
                  min="1"
                  step="1"
                />
              </div>
              <div>
                <Label htmlFor="score">Score (%)</Label>
                <Input
                  id="score"
                  type="number"
                  placeholder="85"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto"
            >
              {submitting ? "Logging..." : "Log Session"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#4A90E2] to-[#7C5CFF] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <div>
              <p className="text-sm text-white/80">Average Score</p>
              <p className="text-3xl font-bold">
                {summary?.averageScore || 0}%
              </p>
            </div>
          </div>
          <p className="text-sm text-white/70">Overall performance</p>
        </div>

        <div className="bg-gradient-to-br from-[#2ED3B7] to-[#22C55E] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8" />
            <div>
              <p className="text-sm text-white/80">Study Hours</p>
              <p className="text-3xl font-bold">
                {Math.round((summary?.totalStudyTime || 0) / 60)}h
              </p>
            </div>
          </div>
          <p className="text-sm text-white/70">Total time studied</p>
        </div>

        <div className="bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8" />
            <div>
              <p className="text-sm text-white/80">Study Sessions</p>
              <p className="text-3xl font-bold">
                {summary?.totalSessions || 0}
              </p>
            </div>
          </div>
          <p className="text-sm text-white/70">Completed sessions</p>
        </div>

        <div className="bg-gradient-to-br from-[#7C5CFF] to-[#9D7FFF] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="w-8 h-8" />
            <div>
              <p className="text-sm text-white/80">Study Streak</p>
              <p className="text-3xl font-bold">
                {summary?.currentStreak || 0}
              </p>
            </div>
          </div>
          <p className="text-sm text-white/70">Days in a row</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#1C1F2A] mb-6">
            Topic Performance
          </h2>
          {summary?.topics?.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={summary.topics}
                margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF3FB" />
                <XAxis
                  dataKey="title"
                  stroke="#6B7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar
                  dataKey="averageScore"
                  fill="#4A90E2"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-center text-sm text-[#6B7280]">
              No topic performance data available yet. Log a session to populate
              this chart.
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#1C1F2A] mb-6">
            Recent Sessions
          </h2>
          {summary?.recentSessions?.length ? (
            <div className="space-y-4">
              {summary.recentSessions.map((session) => (
                <div
                  key={session._id}
                  className="p-4 rounded-3xl border border-gray-100 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#1C1F2A]">
                        {session.topicTitle}
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        {session.score}% • {Math.round(session.studyTime)} min
                      </p>
                    </div>
                    <span className="text-xs text-[#9CA3AF]">
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-center text-sm text-[#6B7280]">
              No sessions logged yet. Add your first study session above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
