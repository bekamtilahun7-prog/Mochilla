import { useState, useEffect } from "react";
import { Send, Sparkles, Search, Plus, FileText } from "lucide-react";
import { aiApi, notesApi, topicsApi } from "../services/api";

interface ConversationMessage {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

interface ConversationSummary {
  id: number;
  title: string;
  timestamp: string;
}

const formatTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const summarizeTitle = (text: string) =>
  text.length > 35 ? `${text.slice(0, 35)}...` : text;

export function AskMochila() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [topics, setTopics] = useState<{ _id: string; title: string }[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const latestAIMessage = [...messages]
    .reverse()
    .find((msg) => msg.type === "ai");

  const noteLines = latestAIMessage
    ? latestAIMessage.content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .slice(0, 6)
    : [];

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await topicsApi.getTopics();
        setTopics(response.data);
      } catch (error) {
        console.error("Failed to load topics:", error);
      }
    };
    loadTopics();
  }, []);

  const handleNewConversation = () => {
    setMessages([]);
    setMessage("");
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    const timestamp = formatTimestamp();
    const userMessage: ConversationMessage = {
      id: Date.now(),
      type: "user",
      content: trimmedMessage,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setConversations((prev) => [
      {
        id: userMessage.id,
        title: summarizeTitle(trimmedMessage),
        timestamp: "Now",
      },
      ...prev,
    ]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiApi.explain({ topic: trimmedMessage });
      const aiContent =
        response.data.explanation || "Sorry, I couldn't generate an answer.";
      const aiMessage: ConversationMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiContent,
        timestamp: formatTimestamp(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Ask Mochila error:", error);
      const aiMessage: ConversationMessage = {
        id: Date.now() + 2,
        type: "ai",
        content: "Sorry, I couldn't reach MOCHILA right now. Please try again.",
        timestamp: formatTimestamp(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToNotes = async () => {
    if (!latestAIMessage || !selectedTopicId) {
      return;
    }

    setSaving(true);

    try {
      await notesApi.createNote({
        topicId: selectedTopicId,
        content: latestAIMessage.content,
      });
      // Reset selection after successful save
      setSelectedTopicId("");
      alert("Note saved successfully!");
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Panel - Chat History */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#7C5CFF] to-[#9D7FFF] text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            New Conversation
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F7F9FC] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredConversations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-center text-sm text-[#6B7280]">
                Start a new conversation with MOCHILA.
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full text-left p-3 rounded-xl hover:bg-[#EEF3FB] transition-colors"
                >
                  <h3 className="font-medium text-[#1C1F2A] text-sm truncate">
                    {conv.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {conv.timestamp}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Center Panel - Chat Interface */}
      <div className="flex-1 flex flex-col bg-[#F7F9FC]">
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7C5CFF] to-[#9D7FFF] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[#1C1F2A]">Ask MOCHILA</h2>
              <p className="text-sm text-[#6B7280]">
                Your AI study assistant is ready to help.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 p-10 text-center text-[#6B7280]">
                <p className="mb-2 font-semibold text-[#1C1F2A]">
                  Start your first study conversation
                </p>
                <p>
                  Ask MOCHILA a topic or question to see instant AI guidance.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      msg.type === "user"
                        ? "bg-[#4A90E2] text-white rounded-2xl rounded-br-sm"
                        : "bg-white border border-gray-200 rounded-2xl rounded-bl-sm"
                    } p-4`}
                  >
                    {msg.type === "ai" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#7C5CFF]" />
                        <span className="text-xs font-semibold text-[#7C5CFF]">
                          MOCHILA AI
                        </span>
                      </div>
                    )}
                    <p
                      className={`whitespace-pre-line ${msg.type === "user" ? "text-white" : "text-[#1C1F2A]"}`}
                    >
                      {msg.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${msg.type === "user" ? "text-white/70" : "text-[#9CA3AF]"}`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask MOCHILA anything..."
                className="flex-1 px-4 py-3 bg-[#F7F9FC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-[#7C5CFF] to-[#9D7FFF] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
              >
                <Send className="w-5 h-5" />
                {loading ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - AI-Generated Notes */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-[#7C5CFF]" />
            <h3 className="font-bold text-[#1C1F2A]">Generated Notes</h3>
          </div>
          <p className="text-sm text-[#6B7280]">
            The latest summary from your conversation.
          </p>
        </div>

        <div className="p-6">
          {latestAIMessage ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[#1C1F2A] mb-3">
                  Latest AI Summary
                </h4>
                <div className="space-y-2">
                  {noteLines.length > 0 ? (
                    noteLines.map((note, index) => (
                      <div
                        key={index}
                        className="p-3 bg-[#7C5CFF]/5 border border-[#7C5CFF]/20 rounded-lg"
                      >
                        <p className="text-sm text-[#1C1F2A]">{note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#6B7280]">
                      {latestAIMessage.content}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#1C1F2A] mb-2">
                    Save to Topic
                  </label>
                  <select
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]"
                  >
                    <option value="">Select a topic</option>
                    {topics.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.title}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSaveToNotes}
                  disabled={saving || !selectedTopicId}
                  className="w-full py-2 px-4 bg-gradient-to-r from-[#7C5CFF] to-[#9D7FFF] text-white rounded-lg hover:shadow-lg transition-all text-sm disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save to Notes Library"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-[#6B7280]">
              Ask a question to MOCHILA and see the notes summary here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
