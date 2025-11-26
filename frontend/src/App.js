import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { createContext, useMemo, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

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

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwt");
  return token ? children : <Navigate to="/login" replace />;
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
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
