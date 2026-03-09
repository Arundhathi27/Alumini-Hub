import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import styles from '../../pages/admin/AdminDashboard.module.css';
import NotificationManager from '../notifications/NotificationManager';
import { useAuth } from '../../context/AuthContext';

const breadcrumbMap = {
    '/admin/dashboard': 'Dashboard',
    '/admin/alumni': 'Alumni Management',
    '/admin/alumni-directory': 'Alumni Directory',
    '/admin/jobs': 'Job Approvals',
    '/admin/event-approvals': 'Event Approvals',
    '/admin/post-event': 'Post Event',
    '/admin/departments': 'Departments',
    '/admin/users': 'Users',
    '/admin/analytics': 'Analytics',
};

const Topbar = ({ title }) => {
    const location = useLocation();
    const { user } = useAuth();
    const currentPage = breadcrumbMap[location.pathname] || title;
    const initial = user?.name?.charAt(0)?.toUpperCase() || 'A';

    return (
        <header className={styles.topbar}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <span className={styles.breadcrumbLink}>Application</span>
                <span className={styles.breadcrumbSep}>›</span>
                <span className={styles.breadcrumbCurrent}>{currentPage}</span>
            </div>

            {/* Right Side */}
            <div className={styles.profileSection}>
                {/* Search */}
                <div className={styles.searchBar}>
                    <Search size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
                    <input
                        className={styles.searchBarInput}
                        placeholder="Search..."
                        type="text"
                    />
                </div>

                {/* Notification Bell */}
                <NotificationManager />

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={styles.avatar}>{initial}</div>
                    <span className={styles.avatarName}>{user?.name || 'Admin'}</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
