import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/student/Sidebar';
import Topbar from '../../components/student/Topbar';
import StudentOverview from './StudentOverview';
import StudentJobs from './StudentJobs';
import StudentEvents from './StudentEvents';
import StudentAlumni from './StudentAlumni';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Topbar title="Student Dashboard" />

                <main className={styles.content}>
                    <Routes>
                        <Route path="/" element={<StudentOverview />} />
                        <Route path="/dashboard" element={<StudentOverview />} />
                        <Route path="/jobs" element={<StudentJobs />} />
                        <Route path="/events" element={<StudentEvents />} />
                        <Route path="/alumni" element={<StudentAlumni />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
