import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/api";

type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("mochila_token") || "mock-token",
  );
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("mochila_user");
    return savedUser ? JSON.parse(savedUser) : {
      _id: "mock-id",
      username: "Guest User",
      email: "guest@example.com",
      role: "admin" // Giving admin role to see all UI parts
    };
  });

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const { token: authToken, user: authUser } = response.data;
    localStorage.setItem("mochila_token", authToken);
    localStorage.setItem("mochila_user", JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    await authApi.register({ username, email, password });
    const loginResponse = await authApi.login({ email, password });
    const { token: authToken, user: authUser } = loginResponse.data;
    localStorage.setItem("mochila_token", authToken);
    localStorage.setItem("mochila_user", JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem("mochila_token");
    localStorage.removeItem("mochila_user");
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, login, register, logout }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
