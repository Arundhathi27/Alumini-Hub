import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Briefcase, Calendar, TrendingUp, CheckCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminDashboard.module.css';

const API_BASE = 'http://localhost:5001';

/* ─── Animation Variants ─── */
const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* ─── Stat Card ─── */
const StatCard = ({ icon: Icon, label, value, iconClass, badge, badgeLabel, delay = 0 }) => (
    <motion.div
        className={styles.card}
        variants={itemVariants}
        whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
        style={{ position: 'relative', overflow: 'hidden' }}
    >
        {/* Subtle diagonal accent */}
        <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 80, height: 80,
            background: 'radial-gradient(circle at 80% 0%, rgba(37,99,235,0.05), transparent 70%)',
            pointerEvents: 'none'
        }} />

        <div className={styles.cardHeader}>
            <motion.div
                className={`${styles.cardIcon} ${iconClass} `}
                whileHover={{ scale: 1.12, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <Icon size={22} />
            </motion.div>
            {badge && (
                <span className={`${styles.cardBadge} ${badge === 'up' ? styles.cardBadgeUp : styles.cardBadgeDown} `}>
                    <TrendingUp size={10} style={{ marginRight: 3 }} />
                    {badgeLabel}
                </span>
            )}
        </div>

        <motion.p
            className={styles.statValue}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {value}
        </motion.p>
        <p className={styles.statLabel}>{label}</p>
    </motion.div>
);

/* ─── Table Row (animated) ─── */
const AnimatedTr = ({ children, index }) => (
    <motion.tr
        className={styles.tr}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.07, duration: 0.35 }}
        whileHover={{ backgroundColor: '#f0f4ff' }}
    >
        {children}
    </motion.tr>
);

/* ─── Avatar Initials ─── */
const Avatar = ({ name, color = '#2563eb' }) => (
    <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: `linear - gradient(135deg, ${color}, ${color}99)`,
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '0.8rem', flexShrink: 0
    }}>
        {name?.charAt(0)?.toUpperCase() || '?'}
    </div>
);

/* ─── Section Header ─── */
const SectionHeader = ({ title, action }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', marginTop: '1.75rem' }}>
        <h3 className={styles.sectionTitle} style={{ marginTop: 0, marginBottom: 0 }}>{title}</h3>
        {action && (
            <motion.button
                whileHover={{ x: 3 }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
                View all <ArrowRight size={13} />
            </motion.button>
        )}
    </div>
);

/* ─── Main Component ─── */
const DashboardOverview = () => {
    const [stats, setStats] = useState({ users: {}, jobs: {}, events: {} });
    const [pendingAlumni, setPendingAlumni] = useState([]);
    const [pendingJobs, setPendingJobs] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const avatarColors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626'];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (!userData || !userData.token) return;

                const config = { headers: { Authorization: `Bearer ${userData.token}` } };

                const [statsRes, alumniRes, jobsRes, eventsRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/admin/analytics/summary`, config),
                    axios.get(`${API_BASE}/api/admin/users?role=Alumni`, config),
                    axios.get(`${API_BASE}/api/alumni/jobs/all?status=Pending`, config),
                    axios.get(`${API_BASE}/api/events/pending`, config)
                ]);

                setStats(statsRes.data);

                // Filter unverified alumni
                const unverified = alumniRes.data.filter(u => !u.isVerified).slice(0, 5);
                setPendingAlumni(unverified);

                // Keep only top 5 jobs/events for overview
                setPendingJobs(jobsRes.data.slice(0, 5));
                setPendingEvents(eventsRes.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching admin dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleApproveAlumni = async (id) => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            await axios.put(`${API_BASE}/api/admin/verify-user/${id}`, { isVerified: true }, { headers: { Authorization: `Bearer ${userData?.token}` } });
            setPendingAlumni(prev => prev.filter(u => u._id !== id));
            setStats(prev => ({
                ...prev,
                users: { ...prev.users, pending: prev.users.pending - 1, verified: prev.users.verified + 1 }
            }));
        } catch (error) {
            console.error('Error approving alumni', error);
        }
    };

    const handleApproveJob = async (id) => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            await axios.put(`${API_BASE}/api/alumni/jobs/${id}/status`, { status: 'Approved' }, { headers: { Authorization: `Bearer ${userData?.token}` } });
            setPendingJobs(prev => prev.filter(j => j._id !== id));
            setStats(prev => ({
                ...prev,
                jobs: { ...prev.jobs, total: prev.jobs.total - 1 } // Approving removes it from pending overall
            }));
        } catch (error) {
            console.error('Error approving job', error);
        }
    };

    const handleApproveEvent = async (id) => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            await axios.put(`${API_BASE}/api/events/verify`, { eventId: id, action: 'Approve' }, { headers: { Authorization: `Bearer ${userData?.token}` } });
            setPendingEvents(prev => prev.filter(e => e._id !== id));
            setStats(prev => ({
                ...prev,
                events: { ...prev.events, total: prev.events.total - 1 }
            }));
        } catch (error) {
            console.error('Error approving event', error);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 size={40} color="#2563eb" />
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show">

            {/* ── Page Title ── */}
            <motion.div variants={fadeIn} style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.4px' }}>
                    Dashboard Overview
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Welcome back, Admin! Here's what's happening today.
                </p>
            </motion.div>

            {/* ── Stat Cards ── */}
            <motion.div className={styles.statsGrid} variants={containerVariants}>
                <StatCard
                    icon={Users} label="Total Alumni" value={stats.users?.verified || 0}
                    iconClass={styles.cardIconBlue} delay={0}
                />
                <StatCard
                    icon={UserPlus} label="Pending Approvals" value={stats.users?.pending || 0}
                    iconClass={styles.cardIconYellow} delay={0.05}
                />
                <StatCard
                    icon={Briefcase} label="Pending Jobs"
                    value={stats.jobs?.byStatus?.find(s => s._id === 'Pending')?.count || 0}
                    iconClass={styles.cardIconGreen} delay={0.1}
                />
                <StatCard
                    icon={Calendar} label="Upcoming Events" value={stats.events?.upcoming || 0}
                    iconClass={styles.cardIconPurple} delay={0.15}
                />
            </motion.div>

            {/* ── Pending Alumni Verifications ── */}
            <motion.div variants={fadeIn}>
                <SectionHeader title="Pending Alumni Verifications" action />
                <motion.div
                    className={styles.tableContainer}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Name</th>
                                <th className={styles.th}>Email</th>
                                <th className={styles.th}>Batch</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {pendingAlumni.length > 0 ? pendingAlumni.map((alum, i) => (
                                    <AnimatedTr key={alum._id} index={i}>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                <Avatar name={alum.name} color={avatarColors[i % avatarColors.length]} />
                                                <span style={{ fontWeight: 600, color: '#111827' }}>{alum.name}</span>
                                            </div>
                                        </td>
                                        <td className={styles.td} style={{ color: '#6b7280' }}>{alum.email}</td>
                                        <td className={styles.td}>
                                            <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>
                                                {alum.batchYear || 'N/A'}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={`${styles.badge} ${styles.badgePending}`}>
                                                <Clock size={10} style={{ marginRight: 3 }} />
                                                Pending
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                                                className={`${styles.actionBtn} ${styles.btnApprove}`}
                                                onClick={() => handleApproveAlumni(alum._id)}
                                            >✓ Approve</motion.button>
                                        </td>
                                    </AnimatedTr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                            No pending alumni verifications.
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </motion.div>
            </motion.div>

            {/* ── Pending Jobs + Events side-by-side ── */}
            <motion.div
                variants={containerVariants}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}
            >
                {/* Pending Jobs */}
                <motion.div variants={fadeIn}>
                    <SectionHeader title="Pending Job Posts" action />
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Company</th>
                                    <th className={styles.th}>Role</th>
                                    <th className={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {pendingJobs.length > 0 ? pendingJobs.map((job, i) => (
                                        <AnimatedTr key={job._id} index={i}>
                                            <td className={styles.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                    <div style={{ width: 28, height: 28, background: '#eff6ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Briefcase size={13} color="#2563eb" />
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{job.company}</span>
                                                </div>
                                            </td>
                                            <td className={styles.td} style={{ color: '#6b7280', fontSize: '0.875rem' }}>{job.role}</td>
                                            <td className={styles.td}>
                                                <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} onClick={() => handleApproveJob(job._id)}
                                                    className={`${styles.actionBtn} ${styles.btnApprove}`} style={{ marginRight: 4 }}>✓</motion.button>
                                            </td>
                                        </AnimatedTr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280' }}>
                                                No pending job posts.
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Pending Events */}
                <motion.div variants={fadeIn}>
                    <SectionHeader title="Pending Event Posts" action />
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Event</th>
                                    <th className={styles.th}>Date</th>
                                    <th className={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {pendingEvents.length > 0 ? pendingEvents.map((event, i) => (
                                        <AnimatedTr key={event._id} index={i}>
                                            <td className={styles.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                    <div style={{ width: 28, height: 28, background: '#faf5ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Calendar size={13} color="#7c3aed" />
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{event.title}</span>
                                                </div>
                                            </td>
                                            <td className={styles.td} style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                                <span style={{ background: '#f0fdf4', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: 5, fontSize: '0.78rem', fontWeight: 600 }}>
                                                    {new Date(event.date).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className={styles.td}>
                                                <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} onClick={() => handleApproveEvent(event._id)}
                                                    className={`${styles.actionBtn} ${styles.btnApprove}`} style={{ marginRight: 4 }}>✓</motion.button>
                                            </td>
                                        </AnimatedTr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280' }}>
                                                No pending event posts.
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>

        </motion.div>
    );
};

export default DashboardOverview;

