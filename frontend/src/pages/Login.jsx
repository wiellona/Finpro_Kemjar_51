import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { login as loginRequest } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await loginRequest({ 
        username, 
        password,
        role: isAdminLogin ? "admin" : "user" 
      });
      login(token, isAdminLogin ? "admin" : "user");
      navigate(isAdminLogin ? "/admin/dashboard" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLoginMode = () => {
    setIsAdminLogin(!isAdminLogin);
    setUsername("");
    setPassword("");
    setError("");
  };

  return (
    <main style={containerStyles}>
      <form onSubmit={handleSubmit} style={formStyles.card}>
        <h1 style={{ marginBottom: "0.25rem" }}>
          {isAdminLogin ? "Admin Dashboard" : "User Dashboard"}
        </h1>
        <p style={{ marginTop: 0, marginBottom: "1.5rem", color: "#64748b" }}>
          {isAdminLogin ? "Admin sign in to continue." : "Sign in to continue."}
        </p>
        
        <label style={formStyles.label} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          style={formStyles.input}
          disabled={loading}
          autoComplete="username"
          required
        />
        
        <label style={formStyles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={formStyles.input}
          disabled={loading}
          autoComplete="current-password"
          required
        />
        
        {error && (
          <p style={errorStyles}>
            {error}
          </p>
        )}
        
        <button type="submit" style={formStyles.button} disabled={loading}>
          {loading ? "Signing in…" : (isAdminLogin ? "Login as Admin" : "Login")}
        </button>

        <div style={toggleStyles}>
          <p style={toggleTextStyles}>
            {isAdminLogin ? "Not an admin?" : "Are you an admin?"}
            <button 
              type="button" 
              onClick={toggleLoginMode}
              style={toggleButtonStyles}
            >
              {isAdminLogin ? "Switch to User Login" : "Click here"}
            </button>
          </p>
        </div>
      </form>
    </main>
  );
};

const containerStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  padding: "1rem",
};

const formStyles = {
  card: {
    width: "100%",
    maxWidth: "360px",
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.2)",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 600,
    marginBottom: "0.25rem",
    color: "#0f172a",
  },
  input: {
    padding: "0.65rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    marginBottom: "0.75rem",
    fontSize: "1rem",
    backgroundColor: "#fff",
    color: "#0f172a",
  },
  button: {
    marginTop: "0.5rem",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    background: "#0f172a",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "1rem",
  },
};

const errorStyles = {
  color: "#dc2626",
  marginTop: "0.5rem",
  marginBottom: "0.5rem",
  fontSize: "0.875rem",
  textAlign: "center",
};

const toggleStyles = {
  marginTop: "1.5rem",
  paddingTop: "1rem",
  borderTop: "1px solid #e2e8f0",
  textAlign: "center",
};

const toggleTextStyles = {
  margin: 0,
  color: "#64748b",
  fontSize: "0.875rem",
};

const toggleButtonStyles = {
  background: "none",
  border: "none",
  color: "#0f172a",
  textDecoration: "underline",
  cursor: "pointer",
  fontWeight: 600,
  marginLeft: "0.25rem",
  fontSize: "0.875rem",
};

export default Login;