import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Search, Bell, User, LogOut } from "lucide-react";

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 fixed top-0 left-0 md:left-64 right-0 z-10 transition-colors duration-300">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for topics, notes, or quizzes..."
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground transition-colors duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {user?.username ?? "Guest"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.role ? `${user.role} Member` : "Not signed in"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}
