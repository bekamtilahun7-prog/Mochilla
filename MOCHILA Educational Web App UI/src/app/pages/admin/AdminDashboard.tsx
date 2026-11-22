import { useEffect, useState } from "react";
import { Users, UserCheck, BookOpen, Activity } from "lucide-react";
import { adminApi } from "../../services/api";

type Stats = {
  totalUsers: number;
  activeUsers: number;
  totalTopics: number;
  logsCount: number;
  totalNotes?: number;
  systemActivity: string;
};

const statCards = [
  {
    label: "Total Users",
    key: "totalUsers",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    label: "Active Users",
    key: "activeUsers",
    icon: UserCheck,
    color: "bg-green-500",
  },
  {
    label: "Total Topics",
    key: "totalTopics",
    icon: BookOpen,
    color: "bg-purple-500",
  },
  {
    label: "Study Logs (24h)",
    key: "logsCount",
    icon: Activity,
    color: "bg-orange-500",
  },
];

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTopics: 0,
    logsCount: 0,
    totalNotes: 0,
    systemActivity: "Loading",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        setStats(response.data.stats);
      } catch (error) {
        console.error("Failed to load admin stats:", error);
        setError("Unable to load admin dashboard metrics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Real-time platform metrics for your MOCHILA admin console.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof Stats];

          return (
            <div
              key={card.label}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <div className={`${card.color} p-3 rounded-full text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-semibold text-gray-900">
                    {loading ? "..." : value}
                  </p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">System activity level</p>
          <p className="mt-3 text-2xl font-semibold text-gray-900">
            {loading ? "..." : stats.systemActivity}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Based on study log volume in the last 24 hours.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total notes</p>
          <p className="mt-3 text-2xl font-semibold text-gray-900">
            {loading ? "..." : (stats.totalNotes ?? "—")}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Total notes stored across all topics.
          </p>
        </div>
      </div>
    </div>
  );
}
