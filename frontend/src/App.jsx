import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { createContext, useMemo, useState } from "react";
import Login from "./pages/Login.jsx";
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

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole) {
    const profile = decodePayload(token);
    if (profile?.role !== requiredRole) {
      // Redirect to appropriate dashboard based on actual role
      return <Navigate to={profile?.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
    }
  }
  
  return children;
};

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem("jwt") || "");
  const [profile, setProfile] = useState(() =>
    decodePayload(localStorage.getItem("jwt"))
  );

  const handleLogin = (jwt, role) => {
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
            element={token ? <Navigate to={profile?.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to={token ? (profile?.role === "admin" ? "/admin/dashboard" : "/dashboard") : "/login"} replace />}
          />
          <Route
            path="*"
            element={<Navigate to={token ? (profile?.role === "admin" ? "/admin/dashboard" : "/dashboard") : "/login"} replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
