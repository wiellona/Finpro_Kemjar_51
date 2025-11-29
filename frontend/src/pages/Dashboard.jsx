import { useContext } from "react";
import { AuthContext } from "../App";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const { profile } = useContext(AuthContext);
  const role = profile?.role || "user";

  return (
    <main>
      {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </main>
  );
};

export default Dashboard;