import React from 'react';
import { User } from 'lucide-react';
import styles from '../../pages/staff/StaffDashboard.module.css';
import NotificationManager from '../notifications/NotificationManager';

const Topbar = ({ title }) => {
    return (
        <header className={styles.topbar}>
            <h2 className={styles.pageTitle}>{title}</h2>

            <div className={styles.profileSection}>
                <NotificationManager />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={styles.iconButton} style={{ background: '#d1fae5', color: '#059669' }}>
                        <User size={20} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Staff Member</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
