import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user || !user.role.includes("admin"))
    return <Navigate to="/access-denied" replace />;
  return children;
}

export default AdminRoute;
