import React from 'react';
import { User } from 'lucide-react';
import styles from '../../pages/alumni/AlumniDashboard.module.css';
import NotificationManager from '../notifications/NotificationManager';

const Topbar = ({ title }) => {
    return (
        <header className={styles.topbar}>
            <h2 className={styles.pageTitle}>{title}</h2>

            <div className={styles.profileSection}>
                <NotificationManager />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={styles.iconButton} style={{ background: '#e0e7ff', color: '#4f46e5' }}>
                        <User size={20} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Alumni User</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
