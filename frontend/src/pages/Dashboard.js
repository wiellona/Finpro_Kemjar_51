import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../App";
import { fetchUsers, changeUserRole, searchUsers } from "../services/api";

const Dashboard = () => {
  const { profile, token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [busyUserId, setBusyUserId] = useState(null);

  const role = profile?.role || "user";
  const username = profile?.username || profile?.sub || "anonymous";

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const loadUsers = async () => {
      try {
        const payload = await fetchUsers(token);
        if (!cancelled) {
          setUsers(payload.users || []);
          setFeedback("");
        }
      } catch (error) {
        if (!cancelled) {
          setFeedback(error.message || "Unable to fetch users.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleRoleUpdate = async (userId, nextRole) => {
    setBusyUserId(userId);
    setFeedback("");
    try {
      const updated = await changeUserRole({ userId, role: nextRole }, token);
      setUsers((current) =>
        current.map((user) =>
          user.id === userId ? { ...user, role: updated.role } : user
        )
      );
    } catch (error) {
      setFeedback(error.message || "Unable to change role.");
    } finally {
      setBusyUserId(null);
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
      const result = await searchUsers(searchQuery, token);
      setSearchStatus(result.message || "Search completed.");
    } catch (error) {
      setSearchStatus(error.message || "Search failed.");
    }
  };

  const filteredUsers = useMemo(() => users, [users]);

  return (
    <main style={{ padding: "2rem", display: "block" }}>
      <div style={styles.card}>
        <header style={styles.header}>
          <div>
            <h2 style={{ margin: 0 }}>Welcome, {username}</h2>
            <p style={{ margin: 0, color: "#64748b" }}>Role: {role}</p>
          </div>
          <button type="button" onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </header>

        {feedback && <p style={{ color: "#dc2626" }}>{feedback}</p>}

        {role === "admin" && (
          <section style={{ marginBottom: "2rem" }}>
            <form onSubmit={handleSearch} style={styles.searchBar}>
              <input
                type="text"
                placeholder="Search username"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.primaryButton}>
                Run Search
              </button>
            </form>
            {searchStatus && <p style={{ color: "#0f172a" }}>{searchStatus}</p>}
          </section>
        )}

        <section>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  {role === "admin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={role === "admin" ? 4 : 3}>Loading users…</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={role === "admin" ? 4 : 3}>
                      No users available.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      {role === "admin" && (
                        <td>
                          <select
                            value={user.role}
                            onChange={(event) =>
                              handleRoleUpdate(user.id, event.target.value)
                            }
                            disabled={busyUserId === user.id}
                            style={styles.select}
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

const styles = {
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
    maxWidth: "960px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  logoutButton: {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "0.5rem 0.85rem",
    background: "transparent",
    cursor: "pointer",
  },
  primaryButton: {
    background: "#0f172a",
    color: "#fff",
    padding: "0.6rem 1.25rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  searchBar: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    padding: "0.65rem 0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  select: {
    padding: "0.35rem",
    borderRadius: "6px",
  },
};

export default Dashboard;
