import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { createContext, useMemo, useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";

export const AuthContext = createContext(null);

const decodePayload = (jwt) => {
  if (!jwt) return null;
  const parts = jwt.split(".");
  if (parts.length < 2) return null;
  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch (error) {
    console.warn("Failed to decode token payload", error);
    return null;
  }
};

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem("jwt") || "");
  const [profile, setProfile] = useState(() =>
    decodePayload(localStorage.getItem("jwt"))
  );

  const handleLogin = (jwt) => {
    localStorage.setItem("jwt", jwt);
    setToken(jwt);
    setProfile(decodePayload(jwt));
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setToken("");
    setProfile(null);
  };

  const contextValue = useMemo(
    () => ({
      token,
      profile,
      login: handleLogin,
      logout: handleLogout,
    }),
    [token, profile]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route
            path="*"
            element={<Navigate to={token ? "/dasshboard" : "/login"} replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
