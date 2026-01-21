import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import DepartmentManagement from './DepartmentManagement';
import JobApprovals from './JobApprovals';
import EventApprovals from './EventApprovals';
import AdminAlumniDirectory from './AdminAlumniDirectory';
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
                        <Route path="alumni-directory" element={<AdminAlumniDirectory />} />
                        <Route path="jobs" element={<JobApprovals />} />
                        <Route path="event-approvals" element={<EventApprovals />} />
                        <Route path="analytics" element={<div>Analytics Module</div>} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
