import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children , allowedRoutes }) => {
  const { token, role } = useContext(AuthContext);
  const isAllowed = allowedRoutes.includes(role);

  return token && isAllowed ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
