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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await loginRequest({ username, password });
      login(token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit} style={formStyles.card}>
        <h1 style={{ marginBottom: "0.25rem" }}>User Dashboard</h1>
        <p style={{ marginTop: 0, marginBottom: "1.5rem", color: "#64748b" }}>
          Sign in to continue.
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
          <p
            style={{
              color: "#dc2626",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            {error}
          </p>
        )}
        <button type="submit" style={formStyles.button} disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>
    </main>
  );
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
    border: "1px solid #cbd5f5",
    marginBottom: "0.75rem",
    fontSize: "1rem",
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
  },
};

export default Login;
