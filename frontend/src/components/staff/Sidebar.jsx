import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CheckCircle,
    Calendar,
    Briefcase,
    LogOut,
    Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../pages/staff/StaffDashboard.module.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/staff/dashboard' },
        { icon: Users, label: 'Alumni Directory', path: '/staff/alumni' },
        { icon: CheckCircle, label: 'Job Verification', path: '/staff/job-verification' },
        { icon: CheckCircle, label: 'Job Verification', path: '/staff/job-verification' },
        { icon: Briefcase, label: 'Jobs', path: '/staff/jobs' },
        { icon: Calendar, label: 'Event Verification', path: '/staff/event-verification' },
        { icon: Calendar, label: 'Events', path: '/staff/events' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <Award size={24} color="#10b981" />
                <span className={styles.logoText}>Alumni Hub</span>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                        }
                    >
                        <item.icon size={18} style={{ marginRight: '0.75rem' }} />
                        {item.label}
                    </NavLink>
                ))}

                <div style={{ flex: 1 }}></div>

                <button onClick={handleLogout} className={styles.navItem} style={{ border: 'none', background: 'transparent', width: '100%' }}>
                    <LogOut size={18} style={{ marginRight: '0.75rem' }} />
                    Logout
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;
