import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, Briefcase, MapPin, Calendar, User, Filter } from 'lucide-react';
import styles from './AdminDashboard.module.css';
import { adminJobService } from '../../services/adminJobService';
import { useNotifications } from '../../context/NotificationContext';

const filterOptions = ['Pending', 'Approved', 'Rejected', 'All'];

const statusClass = {
    Approved: styles.badgeApproved,
    Pending: styles.badgePending,
    Rejected: styles.badgeRejected,
};

const JobApprovals = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');
    const { markByTypeAsRead } = useNotifications();

    useEffect(() => {
        markByTypeAsRead('job_status');
        fetchJobs();
    }, [filter]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await adminJobService.getAllJobs(filter === 'All' ? '' : filter);
            setJobs(data);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this job?`)) return;
        try {
            await adminJobService.updateJobStatus(id, status);
            fetchJobs();
        } catch {
            alert('Failed to update status');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
        >
            {/* ── Page Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}
            >
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 36, height: 36, background: '#eff6ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={18} color="#2563eb" />
                        </div>
                        Job Approvals
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.3rem' }}>
                        Review and manage alumni job postings
                    </p>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '0.35rem', background: '#f3f4f6', padding: '0.25rem', borderRadius: '0.625rem' }}>
                    {filterOptions.map(opt => (
                        <motion.button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: '0.4rem 0.875rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.18s',
                                background: filter === opt ? '#fff' : 'transparent',
                                color: filter === opt ? '#2563eb' : '#6b7280',
                                boxShadow: filter === opt ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            {opt}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* ── Table ── */}
            <motion.div
                className={styles.tableContainer}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Job Title</th>
                            <th className={styles.th}>Company</th>
                            <th className={styles.th}>Posted By</th>
                            <th className={styles.th}>Location</th>
                            <th className={styles.th}>Date</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className={styles.td} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            style={{ width: 28, height: 28, border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', margin: '0 auto' }}
                                        />
                                    </td>
                                </tr>
                            ) : jobs.length === 0 ? (
                                <tr>
                                    <td colSpan="7">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={styles.emptyState}
                                        >
                                            <Briefcase size={40} color="#d1d5db" style={{ marginBottom: '0.75rem' }} />
                                            <p style={{ fontWeight: 600, color: '#374151' }}>No jobs found</p>
                                            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>No {filter.toLowerCase()} job postings at this time.</p>
                                        </motion.div>
                                    </td>
                                </tr>
                            ) : (
                                jobs.map((job, i) => (
                                    <motion.tr
                                        key={job._id}
                                        className={styles.tr}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 16 }}
                                        transition={{ delay: i * 0.06 }}
                                        whileHover={{ backgroundColor: '#f0f4ff' }}
                                    >
                                        <td className={styles.td}>
                                            <span style={{ fontWeight: 600, color: '#111827' }}>{job.title}</span>
                                        </td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: 28, height: 28, background: '#eff6ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <Briefcase size={12} color="#2563eb" />
                                                </div>
                                                {job.company}
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                                                    {job.postedBy?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{job.postedBy?.name || 'Unknown'}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{job.postedBy?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                                <MapPin size={12} style={{ flexShrink: 0 }} />
                                                {job.location || '—'}
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280', fontSize: '0.8125rem' }}>
                                                <Calendar size={12} style={{ flexShrink: 0 }} />
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={`${styles.badge} ${statusClass[job.status] || styles.badgePending}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                                                {job.status === 'Pending' && (
                                                    <>
                                                        <motion.button
                                                            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleStatusUpdate(job._id, 'Approved')}
                                                            title="Approve"
                                                            style={{ width: 30, height: 30, borderRadius: 6, background: '#dcfce7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}
                                                        >
                                                            <Check size={14} />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleStatusUpdate(job._id, 'Rejected')}
                                                            title="Reject"
                                                            style={{ width: 30, height: 30, borderRadius: 6, background: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}
                                                        >
                                                            <X size={14} />
                                                        </motion.button>
                                                    </>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                                                    title="View"
                                                    style={{ width: 30, height: 30, borderRadius: 6, background: '#f3f4f6', border: '1px solid #e5e7eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}
                                                >
                                                    <Eye size={14} />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </motion.div>
        </motion.div>
    );
};

export default JobApprovals;
