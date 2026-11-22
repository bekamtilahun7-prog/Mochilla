import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  MessageSquare,
  FileQuestion,
  CreditCard,
  ClipboardCheck,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/ask-mochila", label: "Ask MOCHILA", icon: MessageSquare },
  { path: "/quiz", label: "Quiz Generator", icon: FileQuestion },
  { path: "/flashcards", label: "Flashcards", icon: CreditCard },
  { path: "/exam", label: "Exam Mode", icon: ClipboardCheck },
  { path: "/notes", label: "Notes Library", icon: BookOpen },
  { path: "/progress", label: "Progress Tracker", icon: TrendingUp },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col fixed left-0 top-0 hidden md:flex z-20 transition-colors duration-300">
      <div className="p-6 border-b border-[var(--sidebar-border)]">
        <h1 className="text-2xl font-bold">MOCHILA</h1>
        <p className="text-sm opacity-70 mt-1">AI Study Assistant</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-lg"
                      : "opacity-70 hover:bg-[var(--sidebar-accent)] hover:opacity-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[var(--sidebar-border)] space-y-3">
        <ThemeSwitcher />
        
        <div className="bg-[var(--sidebar-accent)] rounded-xl p-4">
          <p className="text-sm opacity-70">Need help?</p>
          <button className="mt-2 text-sm text-[var(--sidebar-primary)] hover:text-[var(--success-green)] transition-colors">
            View Tutorial
          </button>
        </div>
      </div>
    </aside>
  );
}