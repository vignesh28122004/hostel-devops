import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  role: "ADMIN" | "STUDENT";
}

export default function ProtectedRoute({ children, role }: Props) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}   