import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const baseURL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("mochila_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("mochila_token");
      localStorage.removeItem("mochila_user");
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    api.post("/api/auth/login", payload),
  register: (payload: { username: string; email: string; password: string }) =>
    api.post("/api/auth/register", payload),
};

export const adminApi = {
  getDashboardStats: () => api.get("/api/admin/dashboard"),
  getUsers: () => api.get("/api/admin/users"),
  getTopics: () => api.get("/api/admin/topics"),
  deleteTopic: (topicId: string) => api.delete(`/api/admin/topics/${topicId}`),
};

export const topicsApi = {
  getTopics: () => api.get("/api/topics"),
  createTopic: (payload: { title: string; description?: string }) =>
    api.post("/api/topics", payload),
};

export const notesApi = {
  getNotes: () => api.get("/api/notes"),
  getNotesByTopic: (topicId: string) => api.get(`/api/notes/topic/${topicId}`),
  createNote: (payload: { topicId: string; content: string }) =>
    api.post("/api/notes", payload),
};

export const logsApi = {
  createLog: (payload: {
    topicId: string;
    studyTime: number;
    score: number;
    date?: string;
  }) => api.post("/api/logs", payload),
  getLogsByTopic: (topicId: string) => api.get(`/api/logs/topic/${topicId}`),
  getSummary: () => api.get("/api/logs/summary"),
};

export const aiApi = {
  explain: (payload: { topic: string }) => api.post("/api/ai/explain", payload),
  quiz: (payload: { topic: string }) => api.post("/api/ai/quiz", payload),
  summarize: (payload: { content: string }) =>
    api.post("/api/ai/summarize", payload),
};

export default api;
