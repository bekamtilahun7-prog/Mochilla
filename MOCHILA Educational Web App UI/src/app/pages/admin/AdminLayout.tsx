import { Link, Navigate, Outlet, useLocation } from "react-router";
import { LayoutDashboard, Users, BookOpen, BarChart3 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/topics", label: "Topics", icon: BookOpen },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminLayout() {
  const location = useLocation();
  const { user } = useAuth();

  if (user && user.role !== "admin") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">MOCHILA Admin</h2>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                      isActive ? "bg-blue-100 text-blue-700" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
