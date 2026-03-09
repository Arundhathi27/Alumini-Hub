import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminEventService } from '../../services/adminEventService';
import { useNotifications } from '../../context/NotificationContext';
import styles from './AdminDashboard.module.css';
import { Check, X, Calendar, MapPin, User, Globe, Clock } from 'lucide-react';

const EventApprovals = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { markByTypeAsRead } = useNotifications();

    useEffect(() => {
        markByTypeAsRead('event_status');
        fetchPendingEvents();
    }, []);

    const fetchPendingEvents = async () => {
        try {
            const data = await adminEventService.getPendingEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching pending events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (eventId, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this event?`)) return;
        try {
            await adminEventService.verifyEvent(eventId, action);
            setEvents(prev => prev.filter(e => e._id !== eventId));
        } catch {
            alert(`Failed to ${action} event`);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}
            >
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 36, height: 36, background: '#faf5ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calendar size={18} color="#7c3aed" />
                        </div>
                        Event Approvals
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.3rem' }}>Review and manage alumni event postings</p>
                </div>
                <span style={{ background: '#faf5ff', color: '#7c3aed', padding: '0.35rem 0.875rem', borderRadius: 999, fontSize: '0.8125rem', fontWeight: 600, border: '1px solid #e9d5ff' }}>
                    {events.length} Pending
                </span>
            </motion.div>

            {/* Table */}
            <motion.div className={styles.tableContainer} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Event Title</th>
                            <th className={styles.th}>Type</th>
                            <th className={styles.th}>Date</th>
                            <th className={styles.th}>Mode</th>
                            <th className={styles.th}>Posted By</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        style={{ width: 28, height: 28, border: '3px solid #e5e7eb', borderTopColor: '#7c3aed', borderRadius: '50%', margin: '0 auto' }} />
                                </td></tr>
                            ) : events.length === 0 ? (
                                <tr><td colSpan="6">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.emptyState}>
                                        <Calendar size={40} color="#d1d5db" style={{ marginBottom: '0.75rem' }} />
                                        <p style={{ fontWeight: 600, color: '#374151' }}>No pending events</p>
                                        <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>All events have been reviewed.</p>
                                    </motion.div>
                                </td></tr>
                            ) : events.map((event, i) => (
                                <motion.tr key={event._id} className={styles.tr}
                                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 16 }} transition={{ delay: i * 0.06 }}
                                    whileHover={{ backgroundColor: '#f5f3ff' }}
                                >
                                    <td className={styles.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                            <div style={{ width: 28, height: 28, background: '#faf5ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Calendar size={13} color="#7c3aed" />
                                            </div>
                                            <span style={{ fontWeight: 600, color: '#111827' }}>{event.title}</span>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <span style={{ background: '#faf5ff', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>{event.type}</span>
                                    </td>
                                    <td className={styles.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280', fontSize: '0.8125rem' }}>
                                            <Clock size={12} /> {event.date}
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280', fontSize: '0.8125rem' }}>
                                            {event.mode === 'Online' ? <Globe size={12} /> : <MapPin size={12} />}
                                            {event.mode}
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                                                {event.postedBy?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{event.postedBy?.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{event.postedBy?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                                            <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                                                onClick={() => handleAction(event._id, 'Approve')}
                                                style={{ width: 30, height: 30, borderRadius: 6, background: '#dcfce7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                                                <Check size={14} />
                                            </motion.button>
                                            <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                                                onClick={() => handleAction(event._id, 'Reject')}
                                                style={{ width: 30, height: 30, borderRadius: 6, background: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                                                <X size={14} />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </motion.div>
        </motion.div>
    );
};

export default EventApprovals;
