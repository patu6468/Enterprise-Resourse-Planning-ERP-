import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage        from "./Component/LoginPage";
import StudentDashboard from "./Component/StudentDashboard";
import FacultyDashboard from "./Component/FacultyDashboard";
import AdminDashboard   from "./Component/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default → Login */}
        <Route path="/"                    element={<LoginPage />} />
        <Route path="/login"               element={<LoginPage />} />

        {/* Role dashboards */}
        <Route path="/student/dashboard"   element={<StudentDashboard />} />
        <Route path="/faculty/dashboard"   element={<FacultyDashboard />} />
        <Route path="/admin/dashboard"     element={<AdminDashboard />} />

        {/* Catch-all → Login */}
        <Route path="*"                    element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
