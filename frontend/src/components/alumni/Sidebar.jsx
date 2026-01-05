import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    Briefcase,
    Calendar,
    FileText,
    MessageSquare,
    LogOut,
    Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../pages/alumni/AlumniDashboard.module.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/alumni/dashboard' },
        { icon: User, label: 'My Profile', path: '/alumni/profile' },
        { icon: Briefcase, label: 'Post Job', path: '/alumni/post-job' },
        { icon: Calendar, label: 'Post Event', path: '/alumni/post-event' },
        { icon: FileText, label: 'My Posts', path: '/alumni/posts' },
        { icon: FileText, label: 'My Events', path: '/alumni/my-events' },
        { icon: MessageSquare, label: 'Messages', path: '/alumni/messages' },
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
