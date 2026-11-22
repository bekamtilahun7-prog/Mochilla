import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { AskMochila } from "./pages/AskMochila";
import { QuizGenerator } from "./pages/QuizGenerator";
import { Flashcards } from "./pages/Flashcards";
import { ExamMode } from "./pages/ExamMode";
import { NotesLibrary } from "./pages/NotesLibrary";
import { ProgressTracker } from "./pages/ProgressTracker";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Users } from "./pages/admin/Users";
import { Topics } from "./pages/admin/Topics";
import { Analytics } from "./pages/admin/Analytics";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          { index: true, Component: Dashboard },
          { path: "ask-mochila", Component: AskMochila },
          { path: "quiz", Component: QuizGenerator },
          { path: "flashcards", Component: Flashcards },
          { path: "exam", Component: ExamMode },
          { path: "notes", Component: NotesLibrary },
          { path: "progress", Component: ProgressTracker },
        ],
      },
      {
        path: "/admin",
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "users", Component: Users },
          { path: "topics", Component: Topics },
          { path: "analytics", Component: Analytics },
        ],
      },
    ],
  },
]);
