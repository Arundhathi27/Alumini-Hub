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
    Award
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
        { icon: Users, label: 'Alumni Management', path: '/admin/alumni' },
        { icon: Briefcase, label: 'Job Approvals', path: '/admin/jobs' },
        { icon: Calendar, label: 'Event Approvals', path: '/admin/events' },
        { icon: UserCheck, label: 'Users', path: '/admin/users' },
        { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <Award size={24} color="#818cf8" />
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
