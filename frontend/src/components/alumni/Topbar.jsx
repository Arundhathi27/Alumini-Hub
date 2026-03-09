import React from 'react';
import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import styles from '../../pages/alumni/AlumniDashboard.module.css';
import NotificationManager from '../notifications/NotificationManager';
import { useAuth } from '../../context/AuthContext';

const breadcrumbMap = {
    '/alumni/dashboard': 'Dashboard',
    '/alumni/jobs/my-jobs': 'My Jobs',
    '/alumni/events/my-events': 'My Events',
    '/alumni/profile': 'Profile',
    '/alumni/posts': 'My Posts',
    '/alumni/messages': 'Messages',
    '/alumni/post-job': 'Post Job',
    '/alumni/post-event': 'Post Event',
};

const Topbar = ({ title }) => {
    const location = useLocation();
    const { user } = useAuth();
    const currentPage = breadcrumbMap[location.pathname] || title;
    const initial = user?.name?.charAt(0)?.toUpperCase() || 'A';

    return (
        <header className={styles.topbar}>
            <div className={styles.breadcrumb}>
                <span className={styles.breadcrumbLink}>Application</span>
                <span className={styles.breadcrumbSep}>›</span>
                <span className={styles.breadcrumbCurrent}>{currentPage}</span>
            </div>

            <div className={styles.profileSection}>
                <div className={styles.searchBar}>
                    <Search size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
                    <input className={styles.searchBarInput} placeholder="Search..." type="text" />
                </div>
                <NotificationManager />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={styles.avatar}>{initial}</div>
                    <span className={styles.avatarName}>{user?.name || 'Alumni'}</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
