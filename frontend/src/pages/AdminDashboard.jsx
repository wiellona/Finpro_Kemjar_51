import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../App";
import { fetchUsers, changeUserRole, searchUsers } from "../services/api";

const AdminDashboard = () => {
    const { profile, token, logout } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [busyUserId, setBusyUserId] = useState(null);

    const username = profile?.username || profile?.sub || "Admin";

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
            // Jika searchUsers mengembalikan data users, update state users
            if (result.users) {
                setUsers(result.users);
            }
        } catch (error) {
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
                            onChange={(event) => setSearchQuery(event.target.value)}
                            style={styles.searchInput}
                        />
                        <button type="submit" style={styles.primaryButton}>
                            Search
                        </button>
                    </form>
                    {searchStatus && <p style={styles.statusText}>{searchStatus}</p>}
                </section>

                <section>
                    <h3 style={styles.sectionTitle}>All Users ({filteredUsers.length})</h3>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Username</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Role</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} style={styles.td}>Loading users…</td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={styles.td}>
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td style={styles.td}>{user.username}</td>
                                            <td style={styles.td}>{user.email}</td>
                                            <td style={styles.td}>{user.role}</td>
                                            <td style={styles.td}>
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