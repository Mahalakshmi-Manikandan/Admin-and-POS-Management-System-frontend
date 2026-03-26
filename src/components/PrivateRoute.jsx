import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../auth";

export default function PrivateRoute({ children, role }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/no-access" replace />;
  }

  return children;
}
