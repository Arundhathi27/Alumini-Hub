import React from 'react';
import { Bell, User } from 'lucide-react';
import styles from '../../pages/student/StudentDashboard.module.css';

const Topbar = ({ title }) => {
    return (
        <header className={styles.topbar}>
            <h2 className={styles.pageTitle}>{title}</h2>

            <div className={styles.profileSection}>
                <div className={styles.iconButton}>
                    <Bell size={20} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={styles.iconButton} style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
                        <User size={20} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Student User</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
