import { useState } from "react";
import { Sun, Moon, Gamepad2, Flower } from "lucide-react";
import { useTheme, ThemeMode } from "../contexts/ThemeContext";

const themes = [
  { mode: "light" as ThemeMode, icon: Sun, label: "Light", color: "#4A90E2" },
  { mode: "dark" as ThemeMode, icon: Moon, label: "Dark", color: "#888888" },
  {
    mode: "dev" as ThemeMode,
    icon: Gamepad2,
    label: "Game Mode",
    color: "#FF0040",
  },
  {
    mode: "flower" as ThemeMode,
    icon: Flower,
    label: "Flower Mode",
    color: "#E91E8C",
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes.find((t) => t.mode === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)]"
        title="Change theme"
      >
        <CurrentIcon
          className="w-5 h-5"
          style={{ color: currentTheme.color }}
        />
        <span className="text-sm">{currentTheme.label}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-40">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isActive = theme === themeOption.mode;

              return (
                <button
                  key={themeOption.mode}
                  onClick={() => {
                    setTheme(themeOption.mode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all hover:bg-[var(--muted)] ${
                    isActive ? "bg-[var(--muted)]" : ""
                  }`}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: themeOption.color }}
                  />
                  <span className="text-sm text-[var(--foreground)]">
                    {themeOption.label}
                  </span>
                  {isActive && (
                    <div
                      className="ml-auto w-2 h-2 rounded-full"
                      style={{ backgroundColor: themeOption.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
