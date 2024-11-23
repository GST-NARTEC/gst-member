import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/member-portal/login" element={<Login />} />
      <Route path="/member-portal/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
