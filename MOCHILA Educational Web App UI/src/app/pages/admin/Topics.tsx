import { useEffect, useState } from "react";
import { adminApi, topicsApi } from "../../services/api";

type TopicItem = {
  _id: string;
  title: string;
  description: string;
  progress: number;
  createdAt: string;
  userId?: {
    username: string;
    email: string;
  };
};

export function Topics() {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDelete, setActiveDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);

  const loadTopics = async () => {
    try {
      const response = await adminApi.getTopics();
      setTopics(response.data.topics);
    } catch (error) {
      console.error("Failed to load topics:", error);
      setError("Unable to load topics. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const handleDelete = async (topicId: string) => {
    setActiveDelete(topicId);
    setError(null);

    try {
      await adminApi.deleteTopic(topicId);
      setTopics((current) => current.filter((topic) => topic._id !== topicId));
    } catch (error) {
      console.error("Failed to delete topic:", error);
      setError("Could not delete topic. Please try again.");
    } finally {
      setActiveDelete(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description } = createForm;

    if (!title.trim()) {
      setError("Topic title is required.");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      await topicsApi.createTopic({
        title: title.trim(),
        description: description.trim(),
      });
      setCreateForm({ title: "", description: "" });
      setShowCreateForm(false);
      // Reload topics to include the new one
      await loadTopics();
    } catch (error) {
      console.error("Failed to create topic:", error);
      setError("Could not create topic. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Topics Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage platform topics and view who created them.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showCreateForm ? "Cancel" : "Create Topic"}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Create New Topic
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter topic title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter topic description (optional)"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Topic"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-gray-500">
          Loading topics...
        </div>
      ) : topics.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-gray-500">
          No topics available.
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((topic) => (
            <div key={topic._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{topic.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Created by {topic.userId?.username ?? "Unknown"}
                    {topic.userId?.email ? ` · ${topic.userId.email}` : ""}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Created on {new Date(topic.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">
                    Progress: {topic.progress ?? 0}%
                  </span>
                  <button
                    onClick={() => handleDelete(topic._id)}
                    disabled={activeDelete === topic._id}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-60"
                  >
                    {activeDelete === topic._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
