import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/student/Sidebar';
import Topbar from '../../components/student/Topbar';
import StudentOverview from './StudentOverview';
import StudentJobs from './StudentJobs';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Topbar title="Student Dashboard" />

                <main className={styles.content}>
                    <Routes>
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<StudentOverview />} />
                        <Route path="jobs" element={<StudentJobs />} />
                        {/* Other routes like directory, events, etc. */}
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
