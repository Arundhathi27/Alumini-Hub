import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import ProfilePage from './pages/alumni/ProfilePage';
import PostJob from './pages/alumni/PostJob';
import MyJobs from './pages/alumni/MyJobs';
import PostEvent from './pages/alumni/PostEvent';
import MyEvents from './pages/alumni/MyEvents';

import AlumniDashboard from './pages/alumni/AlumniDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import StaffJobVerification from './pages/staff/StaffJobVerification';

import { NotificationProvider } from './context/NotificationContext';

// ... imports

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>

            {/* Staff Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Staff']} />}>
              <Route path="/staff/*" element={<StaffDashboard />} />
            </Route>

            {/* Alumni Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Alumni']} />}>
              <Route path="/alumni/profile" element={<ProfilePage />} />
              <Route path="/alumni/post-job" element={<PostJob />} />
              <Route path="/alumni/posts" element={<MyJobs />} />
              <Route path="/alumni/post-event" element={<PostEvent />} />
              <Route path="/alumni/my-events" element={<MyEvents />} />
              <Route path="/alumni/*" element={<AlumniDashboard />} />
            </Route>

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
              <Route path="/student/*" element={<StudentDashboard />} />
            </Route>

            {/* Catch all - Redirect to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
