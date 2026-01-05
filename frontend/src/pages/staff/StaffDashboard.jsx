import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/staff/Sidebar';
import Topbar from '../../components/staff/Topbar';
import StaffOverview from './StaffOverview';
import StaffJobVerification from './StaffJobVerification';
import StaffJobs from './StaffJobs';
import StaffEventVerification from './StaffEventVerification';
import styles from './StaffDashboard.module.css';

const StaffDashboard = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Topbar title="Staff Dashboard" />

                <main className={styles.content}>
                    <Routes>
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<StaffOverview />} />
                        <Route path="job-verification" element={<StaffJobVerification />} />
                        <Route path="event-verification" element={<StaffEventVerification />} />
                        <Route path="jobs" element={<StaffJobs />} />
                        {/* Add other staff routes here */}
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default StaffDashboard;
