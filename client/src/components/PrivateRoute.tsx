// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import type { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  return user ? children : <Navigate to="/signup" replace />;
};

export default PrivateRoute;
