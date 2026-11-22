import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";

export function Analytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTopics: 0,
    systemActivity: "Loading",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        setStats(response.data.stats);
      } catch (error) {
        console.error("Failed to load analytics stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            High-level usage metrics based on your MOCHILA data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Engagement
          </h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {loading ? "..." : stats.activeUsers}
          </p>
          <p className="text-sm text-gray-500">
            Active users in the last 7 days
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Total Topics
          </h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {loading ? "..." : stats.totalTopics}
          </p>
          <p className="text-sm text-gray-500">
            Topics created across the platform
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Activity
          </h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {loading ? "..." : stats.systemActivity}
          </p>
          <p className="text-sm text-gray-500">
            Recent study log activity level
          </p>
        </div>
      </div>
    </div>
  );
}
