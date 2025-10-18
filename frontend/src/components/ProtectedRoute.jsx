import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  if (!token) return <Navigate to="/access-denied" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/access-denied" replace />;
    }
  } catch {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}

export default ProtectedRoute;
