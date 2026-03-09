import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Calendar,
    UserCheck,
    LogOut,
    BarChart2,
    Award,
    Building2,
    PlusCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../pages/admin/AdminDashboard.module.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Alumni Directory', path: '/admin/alumni-directory' },
        { icon: Briefcase, label: 'Job Approvals', path: '/admin/jobs' },
        { icon: Calendar, label: 'Event Approvals', path: '/admin/event-approvals' },
        { icon: PlusCircle, label: 'Post Event', path: '/admin/post-event' },
        { icon: Building2, label: 'Departments', path: '/admin/departments' },
        { icon: UserCheck, label: 'Users', path: '/admin/users' },
        { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    ];

    return (
        <aside className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.logoContainer}>
                <Award size={26} style={{ color: '#93c5fd', flexShrink: 0 }} />
                <div>
                    <span className={styles.logoText}>Alumni Hub</span>
                    <span className={styles.roleBadgeAdmin}>Admin</span>
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
