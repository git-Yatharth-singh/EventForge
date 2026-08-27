import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { login as loginRequest } from "../api/authApi";
import { getUserByEmail, signup as signupRequest } from "../api/userApi";
import { getToken, setToken, clearToken, registerUnauthorizedHandler } from "../api/axios";
import { getEmailFromToken, isTokenExpired } from "../utils/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | guest

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
    setStatus("guest");
  }, []);

  // Global 401/403 handler wired into the axios instance once.
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setTokenState(null);
      setUser(null);
      setStatus("guest");
    });
  }, []);

  // On boot, restore session from a stored token if it's still valid.
  useEffect(() => {
    const existing = getToken();
    if (!existing || isTokenExpired(existing)) {
      clearToken();
      setStatus("guest");
      return;
    }
    const email = getEmailFromToken(existing);
    if (!email) {
      clearToken();
      setStatus("guest");
      return;
    }
    getUserByEmail(email)
      .then((u) => {
        setUser(u);
        setTokenState(existing);
        setStatus("authenticated");
      })
      .catch(() => {
        clearToken();
        setStatus("guest");
      });
  }, []);

  const login = useCallback(async (email, password) => {
    const jwt = await loginRequest(email, password);
    setToken(jwt);
    setTokenState(jwt);
    const u = await getUserByEmail(email);
    setUser(u);
    setStatus("authenticated");
    return u;
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    await signupRequest({ name, email, password });
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      status,
      isAuthenticated: status === "authenticated",
      login,
      signup,
      logout,
    }),
    [token, user, status, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
