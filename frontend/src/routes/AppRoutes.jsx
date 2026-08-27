import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/landing/LandingPage";

import Login from "../pages/auth/Login";

import Register from "../pages/auth/Register";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import RoleGuard from "../components/auth/RoleGuard";

import DashboardLayout from "../components/layout/DashboardLayout";

import MentorLayout from "../components/mentor/MentorLayout";

import MentorDashboard from "../pages/mentor/MentorDashboard";

// Admin Tab Pages
import AdminDashboard from "../pages/admin/AdminDashboard";

import AdminApplications from "../pages/admin/AdminApplications";

import UserManagement from "../pages/admin/UserManagement";

import AdminBatches from "../pages/admin/AdminBatches";

import AdminAttendance from "../pages/admin/AdminAttendance";

import AdminAssignments from "../pages/admin/AdminAssignments";

import AdminAnnouncements from "../pages/admin/AdminAnnouncements";

import AdminCurriculum from "../pages/admin/AdminCurriculum";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing & Authentication */}
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="applications" element={<AdminApplications />} />

            <Route path="users" element={<UserManagement />} />

            <Route path="batches" element={<AdminBatches />} />

            <Route path="attendance" element={<AdminAttendance />} />

            <Route path="assignments" element={<AdminAssignments />} />

            <Route path="announcements" element={<AdminAnnouncements />} />

            <Route path="curriculum" element={<AdminCurriculum />} />
          </Route>
        </Route>
      </Route>

      {/* Protected Mentor Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowedRoles={["mentor"]} />}>
          <Route path="/mentor" element={<MentorLayout />}>
            <Route index element={<MentorDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
