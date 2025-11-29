import { useContext } from "react";
import { AuthContext } from "../App";

const UserDashboard = () => {
    const { profile, logout } = useContext(AuthContext);
    const username = profile?.username || profile?.sub || "User";

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <header style={styles.header}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "2rem" }}>Welcome, {username}!</h1>
                        <p style={{ margin: "0.5rem 0 0 0", color: "#64748b" }}>
                            You are logged in as a user.
                        </p>
                    </div>
                    <button type="button" onClick={logout} style={styles.logoutButton}>
                        Logout
                    </button>
                </header>

                <div style={styles.content}>
                    <div style={styles.welcomeSection}>
                        <h2 style={styles.welcomeTitle}>User Dashboard</h2>
                        <p style={styles.welcomeText}>
                            This is your personal dashboard. Here you can view your account
                            information and access user-specific features.
                        </p>
                    </div>

                    <div style={styles.featuresGrid}>
                        <div style={styles.featureCard}>
                            <h3 style={styles.featureTitle}>Profile</h3>
                            <p style={styles.featureText}>
                                View and manage your personal profile information.
                            </p>
                        </div>

                        <div style={styles.featureCard}>
                            <h3 style={styles.featureTitle}>Settings</h3>
                            <p style={styles.featureText}>
                                Configure your account preferences and settings.
                            </p>
                        </div>

                        <div style={styles.featureCard}>
                            <h3 style={styles.featureTitle}>Activities</h3>
                            <p style={styles.featureText}>
                                Track your recent activities and history.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
    },
    card: {
        background: "#fff",
        borderRadius: "16px",
        padding: "3rem",
        boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
        maxWidth: "800px",
        width: "100%",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "3rem",
        paddingBottom: "2rem",
        borderBottom: "1px solid #e2e8f0",
    },
    logoutButton: {
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "0.75rem 1.5rem",
        background: "transparent",
        cursor: "pointer",
        fontWeight: "500",
        fontSize: "1rem",
    },
    content: {
        textAlign: "center",
    },
    welcomeSection: {
        marginBottom: "3rem",
    },
    welcomeTitle: {
        fontSize: "1.5rem",
        marginBottom: "1rem",
        color: "#0f172a",
    },
    welcomeText: {
        fontSize: "1.1rem",
        color: "#64748b",
        lineHeight: "1.6",
        maxWidth: "600px",
        margin: "0 auto",
    },
    featuresGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem",
        marginTop: "2rem",
    },
    featureCard: {
        padding: "1.5rem",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        backgroundColor: "#f8fafc",
    },
    featureTitle: {
        margin: "0 0 0.75rem 0",
        color: "#0f172a",
        fontSize: "1.1rem",
    },
    featureText: {
        margin: 0,
        color: "#64748b",
        lineHeight: "1.5",
    },
};

export default UserDashboard;