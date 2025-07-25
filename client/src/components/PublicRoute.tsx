// src/components/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import type { JSX } from "react";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  return user ? <Navigate to="/blogs" replace /> : children;
};

export default PublicRoute;
