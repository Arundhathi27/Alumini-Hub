import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/staff/Sidebar';
import Topbar from '../../components/staff/Topbar';
import StaffOverview from './StaffOverview';
import StaffJobVerification from './StaffJobVerification';
import StaffJobs from './StaffJobs';
import StaffEventVerification from './StaffEventVerification';
import StaffEvents from './StaffEvents';
import styles from './StaffDashboard.module.css';

const StaffDashboard = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Topbar title="Staff Dashboard" />

                <main className={styles.content}>
                    <Routes>
                        <Route path="/" element={<StaffOverview />} />
                        <Route path="/dashboard" element={<StaffOverview />} />
                        <Route path="/job-verification" element={<StaffJobVerification />} />
                        <Route path="/jobs" element={<StaffJobs />} />
                        <Route path="/event-verification" element={<StaffEventVerification />} />
                        <Route path="/events" element={<StaffEvents />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default StaffDashboard;
