import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  FileText,
  Download,
  Trash2,
  Edit,
  Calendar,
} from "lucide-react";
import { notesApi, topicsApi } from "../services/api";

interface Note {
  _id: string;
  content: string;
  topicId: { title: string } | string;
  createdAt: string;
}

interface Topic {
  _id: string;
  title: string;
}

export function NotesLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [createForm, setCreateForm] = useState({ topicId: "", content: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await notesApi.getNotes();
        setNotes(response.data.notes || []);
      } catch (err) {
        console.error("Failed to load notes:", err);
        setError("Unable to load notes at the moment.");
      } finally {
        setLoading(false);
      }
    };

    const loadTopics = async () => {
      try {
        const response = await topicsApi.getTopics();
        setTopics(response.data);
      } catch (err) {
        console.error("Failed to load topics:", err);
      }
    };

    loadNotes();
    loadTopics();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { topicId, content } = createForm;

    if (!topicId || !content.trim()) {
      setError("Please select a topic and enter note content.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      await notesApi.createNote({
        topicId,
        content: content.trim(),
      });
      setCreateForm({ topicId: "", content: "" });
      setShowCreateForm(false);
      // Reload notes to include the new one
      const response = await notesApi.getNotes();
      setNotes(response.data.notes || []);
    } catch (err) {
      console.error("Failed to create note:", err);
      setError("Could not create note. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const topicTitle =
      typeof note.topicId === "string" ? note.topicId : note.topicId.title;
    return (
      topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1C1F2A] mb-2">
          Notes Library
        </h1>
        <p className="text-[#6B7280]">
          All your AI-generated notes in one organized place
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes by topic or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#F7F9FC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />
          </div>

          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7C5CFF] to-[#9D7FFF] text-white rounded-xl hover:shadow-lg transition-all"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus className="w-5 h-5" />
            {showCreateForm ? "Cancel" : "New Note"}
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-[#1C1F2A] mb-4">
            Create New Note
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1C1F2A] mb-2">
                Topic *
              </label>
              <select
                value={createForm.topicId}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    topicId: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-[#F7F9FC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                required
              >
                <option value="">Select a topic</option>
                {topics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1C1F2A] mb-2">
                Note Content *
              </label>
              <textarea
                value={createForm.content}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-[#F7F9FC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2] resize-none"
                placeholder="Enter your study notes..."
                rows={6}
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Note"}
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

      {loading ? (
        <div className="text-center py-16 text-[#6B7280]">
          Loading your notes...
        </div>
      ) : error ? (
        <div className="text-center py-16 text-[#EF4444]">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => {
            const topicTitle =
              typeof note.topicId === "string"
                ? note.topicId
                : note.topicId.title;
            const preview =
              note.content.length > 120
                ? `${note.content.slice(0, 120)}...`
                : note.content;
            return (
              <div
                key={note._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="h-2 bg-[#7C5CFF]"></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#7C5CFF]/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#7C5CFF]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1C1F2A] group-hover:text-[#4A90E2] transition-colors">
                          {topicTitle}
                        </h3>
                        <p className="text-sm text-[#6B7280]">Study note</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#6B7280] mb-4 line-clamp-3">
                    {preview}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                      <Calendar className="w-3 h-3" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-[#EF4444]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredNotes.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#1C1F2A] mb-2">
            No notes found
          </h3>
          <p className="text-[#6B7280]">
            Try a different search phrase or create a new note.
          </p>
        </div>
      )}
    </div>
  );
}
