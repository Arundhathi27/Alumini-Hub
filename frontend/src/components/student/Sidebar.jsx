import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Calendar,
    MessageCircle,
    LogOut,
    Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../pages/student/StudentDashboard.module.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
        { icon: Briefcase, label: 'Jobs', path: '/student/jobs' },
        { icon: Calendar, label: 'Events', path: '/student/events' },
        { icon: Users, label: 'Alumni Directory', path: '/student/alumni' },
        { icon: MessageCircle, label: 'Messages', path: '/student/messages' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <Award size={26} style={{ color: '#93c5fd', flexShrink: 0 }} />
                <div>
                    <span className={styles.logoText}>Alumni Hub</span>
                    <span className={styles.roleBadgeStudent}>Student</span>
                </div>
            </div>

            <nav className={styles.nav}>
                <span className={styles.navSection}>Main Menu</span>

                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.navItem} ${styles.navItemActive}`
                                : styles.navItem
                        }
                    >
                        <item.icon size={17} />
                        {item.label}
                    </NavLink>
                ))}

                <div style={{ flex: 1 }} />
                <div className={styles.navDivider} />

                <button onClick={handleLogout} className={styles.navItem}>
                    <LogOut size={17} />
                    Logout
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;
