import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/landing/LandingPage';
import ApplyPage from '../pages/landing/ApplyPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RoleGuard from '../components/auth/RoleGuard';
import DashboardLayout from '../components/layout/DashboardLayout';

// Admin Tab Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminApplications from '../pages/admin/AdminApplications';
import UserManagement from '../pages/admin/UserManagement';
import AdminBatches from '../pages/admin/AdminBatches';
import AdminAttendance from '../pages/admin/AdminAttendance';
import AdminAssignments from '../pages/admin/AdminAssignments';
import AdminAnnouncements from '../pages/admin/AdminAnnouncements';
import AdminCurriculum from '../pages/admin/AdminCurriculum';

// Mentor Tab Pages
import MentorDashboard from '../pages/mentor/MentorDashboard';
import MentorBatches from '../pages/mentor/MentorBatches';
import MentorAssignments from '../pages/mentor/MentorAssignments';
import MentorAttendance from '../pages/mentor/MentorAttendance';
import MentorResources from '../pages/mentor/MentorResources';
import MentorProgress from '../pages/mentor/MentorProgress';
import MentorAnnouncements from '../pages/mentor/MentorAnnouncements';

// Student Tab Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentAssignments from '../pages/student/StudentAssignments';
import StudentAttendance from '../pages/student/StudentAttendance';
import StudentProgress from '../pages/student/StudentProgress';
import StudentResources from '../pages/student/StudentResources';
import StudentAnnouncements from '../pages/student/StudentAnnouncements';

// Shared Pages
import Messaging from '../pages/shared/Messaging';
import Settings from '../pages/shared/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing & Authentication */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowedRoles={['admin']} />}>
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
        
        {/* Protected Mentor Routes */}
        <Route element={<RoleGuard allowedRoles={['mentor']} />}>
          <Route path="/mentor" element={<DashboardLayout />}>
            <Route index element={<MentorDashboard />} />
            <Route path="batches" element={<MentorBatches />} />
            <Route path="assignments" element={<MentorAssignments />} />
            <Route path="attendance" element={<MentorAttendance />} />
            <Route path="progress" element={<MentorProgress />} />
            <Route path="announcements" element={<MentorAnnouncements />} />
            <Route path="resources" element={<MentorResources />} />
          </Route>
        </Route>

        {/* Protected Student Routes */}
        <Route element={<RoleGuard allowedRoles={['student']} />}>
          <Route path="/student" element={<DashboardLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="progress" element={<StudentProgress />} />
            <Route path="announcements" element={<StudentAnnouncements />} />
            <Route path="resources" element={<StudentResources />} />
          </Route>
        </Route>

        {/* Shared Authenticated Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/messages" element={<Messaging />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
