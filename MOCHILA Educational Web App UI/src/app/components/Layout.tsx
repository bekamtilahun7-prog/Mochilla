import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ThemeProvider } from "../contexts/ThemeContext";

export function Layout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Sidebar />
        <Navbar />
        <main className="ml-0 md:ml-64 pt-16 min-h-screen">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}