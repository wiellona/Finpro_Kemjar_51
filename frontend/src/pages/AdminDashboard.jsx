import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../App";
import { getDashboard, changeUserRole, searchUsers } from "../services/api";

const AdminDashboard = () => {
  const { profile, token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState(null);
  const [busyUsername, setBusyUsername] = useState(null);

  const username = profile?.username || "Admin";

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        const payload = await getDashboard(token);
        if (!cancelled) {
          setFeedback("");
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setFeedback(error.message || "Unable to load dashboard.");
          setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleRoleUpdate = async (targetUsername, nextRole) => {
    setBusyUsername(targetUsername);
    setFeedback("");
    try {
      const result = await changeUserRole(
        { username: targetUsername, role: nextRole },
        token
      );
      setFeedback(result.message || "Role updated successfully.");
      // Update the user in the list
      setUsers((current) =>
        current.map((user) =>
          user.username === targetUsername ? { ...user, role: nextRole } : user
        )
      );
    } catch (error) {
      setFeedback(error.message || "Unable to change role.");
    } finally {
      setBusyUsername(null);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      setSearchStatus("Please enter a username fragment to search.");
      return;
    }

    setSearchStatus("Searching…");
    try {
      const result = await searchUsers(searchQuery.trim(), token);
      setUsers(result.data || []);
      setSearchStatus(result.message || "Search completed.");
      // Update users with search results
      if (result.exist) {
        setSearchStatus("found"); // Ini cocok dengan kondisi JSX kamu
      } else {
        setSearchStatus("not_found"); // Ini juga cocok
      }
    } catch (error) {
      console.error(error);
      setSearchStatus(error.message || "Search failed.");
    }
  };

  const filteredUsers = useMemo(() => users, [users]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <div>
            <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
            <p style={{ margin: 0, color: "#64748b" }}>Welcome, {username}</p>
          </div>
          <button type="button" onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </header>

        {feedback && <p style={styles.errorText}>{feedback}</p>}

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={styles.sectionTitle}>User Management</h3>
          <form onSubmit={handleSearch} style={styles.searchBar}>
            <input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchStatus(null);
              }}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.primaryButton}>
              Search
            </button>
          </form>
          {searchStatus === "found" && (
            <div style={styles.successBox}>
              <strong>Confirmed!</strong> The user "{searchQuery.trim()}" exists
              in the database.
            </div>
          )}

          {searchStatus === "not_found" && (
            <div style={styles.infoBox}>
              <strong>Not Found.</strong> The username "{searchQuery.trim()}" is
              not registered.
            </div>
          )}
        </section>

        <section>
          <h3 style={styles.sectionTitle}>
            User List ({filteredUsers.length})
          </h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} style={styles.td}>
                      Loading…
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={styles.td}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id || user.username}>
                      <td style={styles.td}>{user.username}</td>
                      <td style={styles.td}>{user.role}</td>
                      <td style={styles.td}>
                        <select
                          value={user.role}
                          onChange={(event) =>
                            handleRoleUpdate(user.username, event.target.value)
                          }
                          disabled={busyUsername === user.username}
                          style={styles.select}
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
    maxWidth: "1200px",
    width: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e2e8f0",
  },
  logoutButton: {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    background: "transparent",
    cursor: "pointer",
    fontWeight: "500",
  },
  primaryButton: {
    background: "#0f172a",
    color: "#fff",
    padding: "0.65rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
  },
  searchBar: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
    marginBottom: "1rem",
  },
  searchInput: {
    flex: 1,
    padding: "0.65rem 0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
  },
  sectionTitle: {
    marginBottom: "1rem",
    color: "#0f172a",
  },
  tableWrapper: {
    overflowX: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "1rem",
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    fontWeight: "600",
    color: "#0f172a",
  },
  td: {
    padding: "1rem",
    borderBottom: "1px solid #e2e8f0",
  },
  select: {
    padding: "0.35rem 0.5rem",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
  },
  errorText: {
    color: "#dc2626",
    marginBottom: "1rem",
    padding: "0.75rem",
    backgroundColor: "#fef2f2",
    borderRadius: "8px",
    border: "1px solid #fecaca",
  },
  statusText: {
    color: "#0f172a",
    marginBottom: "1rem",
  },
};

export default AdminDashboard;
