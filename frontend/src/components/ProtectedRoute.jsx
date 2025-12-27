import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard if they try to access a wrong one
        // Or we could show an existing "Unauthorized" page. 
        // For now, let's bounce them to their correct home based on their role
        switch (user.role) {
            case 'Admin': return <Navigate to="/admin/dashboard" replace />;
            case 'Staff': return <Navigate to="/staff/dashboard" replace />;
            case 'Alumni': return <Navigate to="/alumni/dashboard" replace />;
            case 'Student': return <Navigate to="/student/dashboard" replace />;
            default: return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
