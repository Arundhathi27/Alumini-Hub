import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import DepartmentManagement from './DepartmentManagement';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Topbar title="Admin Dashboard" />

                <main className={styles.content}>
                    <Routes>
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardOverview />} />

                        <Route path="users" element={<UserManagement />} />
                        <Route path="departments" element={<DepartmentManagement />} />
                        {/* Placeholder routes for others to avoid 404 in console if clicked */}
                        <Route path="alumni" element={<div>Alumni Management Module</div>} />
                        <Route path="jobs" element={<div>Job Approvals Module</div>} />
                        <Route path="events" element={<div>Event Approvals Module</div>} />
                        <Route path="analytics" element={<div>Analytics Module</div>} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
