import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, Briefcase, CheckSquare, ArrowRight, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './StaffDashboard.module.css';

const API_BASE = 'http://localhost:5001';

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const StatCard = ({ icon: Icon, label, value, iconClass, badge }) => (
    <motion.div className={styles.card} variants={itemVariants}
        whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
        style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'radial-gradient(circle at 80% 0%,rgba(37,99,235,0.05),transparent 70%)', pointerEvents: 'none' }} />
        <div className={styles.cardHeader}>
            <motion.div className={`${styles.cardIcon} ${iconClass}`} whileHover={{ scale: 1.12, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Icon size={22} />
            </motion.div>
            {badge && (
                <span className={`${styles.cardBadge} ${styles.cardBadgeUp}`}>
                    <TrendingUp size={10} style={{ marginRight: 3 }} />{badge}
                </span>
            )}
        </div>
        <motion.p className={styles.statValue} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            {value}
        </motion.p>
        <p className={styles.statLabel}>{label}</p>
    </motion.div>
);

const QuickActionCard = ({ icon: Icon, title, desc, color, bg, onClick }) => (
    <motion.div whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.98 }}
        onClick={onClick}
        style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', border: '1px solid #f0f0f5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ width: 44, height: 44, borderRadius: '0.625rem', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={20} color={color} />
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>{title}</div>
            <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.15rem' }}>{desc}</div>
        </div>
        <ArrowRight size={16} color="#9ca3af" />
    </motion.div>
);

const StaffOverview = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalAlumni: 0, pendingJobs: 0, pendingEvents: 0, approvedJobs: 0 });
    const [pendingEventList, setPendingEventList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (!userData || !userData.token) return;
                const config = { headers: { Authorization: `Bearer ${userData.token}` } };

                const [alumniRes, pendingJobsRes, pendingEventsRes, approvedJobsRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/alumni`, config), // Get verified alumni
                    axios.get(`${API_BASE}/api/jobs/pending`, config), // Ensure this endpoint functions for Staff
                    axios.get(`${API_BASE}/api/events/pending`, config), // Ensure this endpoint functions for Staff
                    axios.get(`${API_BASE}/api/jobs`, config) // Approved jobs
                ]);

                setStats({
                    totalAlumni: alumniRes.data?.length || 0,
                    pendingJobs: pendingJobsRes.data?.length || 0,
                    pendingEvents: pendingEventsRes.data?.length || 0,
                    approvedJobs: approvedJobsRes.data?.length || 0,
                });

                // Take top 5 pending events
                setPendingEventList((pendingEventsRes.data || []).slice(0, 5));
            } catch (error) {
                console.error("Error fetching staff dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleApproveEvent = async (id) => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            await axios.put(`${API_BASE}/api/events/verify`, { eventId: id, action: 'Approve' }, { headers: { Authorization: `Bearer ${userData?.token}` } });
            setPendingEventList(prev => prev.filter(e => e._id !== id));
            setStats(prev => ({ ...prev, pendingEvents: prev.pendingEvents - 1 }));
        } catch (error) {
            console.error('Error approving event', error);
        }
    };

    const handleRejectEvent = async (id) => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            await axios.put(`${API_BASE}/api/events/verify`, { eventId: id, action: 'Reject' }, { headers: { Authorization: `Bearer ${userData?.token}` } });
            setPendingEventList(prev => prev.filter(e => e._id !== id));
            setStats(prev => ({ ...prev, pendingEvents: prev.pendingEvents - 1 }));
        } catch (error) {
            console.error('Error rejecting event', error);
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
            {/* Page Title */}
            <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.4px' }}>Staff Dashboard</h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Review verifications and manage alumni activities.</p>
            </motion.div>

            {/* Stat Cards */}
            <motion.div className={styles.statsGrid} variants={containerVariants}>
                <StatCard icon={Users} label="Total Alumni" value={stats.totalAlumni} iconClass={styles.cardIconBlue} />
                <StatCard icon={CheckSquare} label="Pending Job Verifications" value={stats.pendingJobs} iconClass={styles.cardIconYellow} />
                <StatCard icon={Calendar} label="Pending Event Verifications" value={stats.pendingEvents} iconClass={styles.cardIconPurple} />
                <StatCard icon={Briefcase} label="Approved Jobs" value={stats.approvedJobs} iconClass={styles.cardIconGreen} />
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} style={{ marginBottom: '1.75rem' }}>
                <h3 className={styles.sectionTitle} style={{ marginTop: 0, marginBottom: '1rem' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    <QuickActionCard icon={Briefcase} title="Job Approvals" desc="Review pending job posts" color="#2563eb" bg="#eff6ff" onClick={() => navigate('/staff/job-approvals')} />
                    <QuickActionCard icon={Calendar} title="Event Approvals" desc="Review pending events" color="#7c3aed" bg="#faf5ff" onClick={() => navigate('/staff/event-approvals')} />
                    <QuickActionCard icon={Users} title="Alumni Directory" desc="Browse verified alumni" color="#16a34a" bg="#f0fdf4" onClick={() => navigate('/staff/alumni')} />
                </div>
            </motion.div>

            {/* Pending Event Verifications Preview */}
            <motion.div variants={itemVariants}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                    <h3 className={styles.sectionTitle} style={{ marginTop: 0, marginBottom: 0 }}>Pending Event Verifications</h3>
                    <motion.button whileHover={{ x: 3 }} onClick={() => navigate('/staff/event-approvals')}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                        View all <ArrowRight size={13} />
                    </motion.button>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Event Name</th>
                                <th className={styles.th}>Date</th>
                                <th className={styles.th}>Posted By</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {pendingEventList.length > 0 ? pendingEventList.map((event, i) => (
                                    <motion.tr key={event._id} className={styles.tr}
                                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                                        transition={{ delay: i * 0.07 }} whileHover={{ backgroundColor: '#f0f4ff' }}>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                <div style={{ width: 28, height: 28, background: '#faf5ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Calendar size={13} color="#7c3aed" />
                                                </div>
                                                <span style={{ fontWeight: 600, color: '#111827' }}>{event.title}</span>
                                            </div>
                                        </td>
                                        <td className={styles.td} style={{ color: '#6b7280', fontSize: '0.875rem' }}>{new Date(event.date).toLocaleDateString()}</td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700 }}>
                                                    {event.postedBy?.name?.charAt(0) || 'U'}
                                                </div>
                                                <span style={{ fontSize: '0.875rem', color: '#374151' }}>{event.postedBy?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>
                                        </td>
                                        <td className={styles.td}>
                                            <motion.button onClick={() => handleApproveEvent(event._id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                                                className={`${styles.actionBtn} ${styles.btnApprove}`}>✓ Approve</motion.button>
                                            <motion.button onClick={() => handleRejectEvent(event._id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                                                className={`${styles.actionBtn} ${styles.btnReject}`}>✗ Reject</motion.button>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className={styles.td} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                            No pending events to verify.
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StaffOverview;
