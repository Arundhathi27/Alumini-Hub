import React, { useState, useEffect } from 'react';
import { adminEventService } from '../../services/adminEventService';
import styles from '../alumni/AlumniDashboard.module.css'; // Reuse existing styles
import { Check, X, Calendar } from 'lucide-react';

const EventApprovals = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            // Remove from list
            setEvents(prev => prev.filter(e => e._id !== eventId));
            alert(`Event ${action}ed successfully`);
        } catch (error) {
            alert(`Failed to ${action} event`);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header} style={{ marginBottom: '2rem' }}>
                <h2 className={styles.title}>Event Verification</h2>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tr}>
                                <th className={styles.th}>Event Title</th>
                                <th className={styles.th}>Type</th>
                                <th className={styles.th}>Date</th>
                                <th className={styles.th}>Mode</th>
                                <th className={styles.th}>Posted By</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className={styles.td} style={{ textAlign: 'center' }}>Loading...</td></tr>
                            ) : events.length === 0 ? (
                                <tr><td colSpan="6" className={styles.td} style={{ textAlign: 'center' }}>No pending events found.</td></tr>
                            ) : (
                                events.map((event) => (
                                    <tr key={event._id} className={styles.tr}>
                                        <td className={styles.td} style={{ fontWeight: 500 }}>{event.title}</td>
                                        <td className={styles.td}>{event.type}</td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Calendar size={14} /> {event.date}
                                            </div>
                                        </td>
                                        <td className={styles.td}>{event.mode}</td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 500 }}>{event.postedBy?.name}</span>
                                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{event.postedBy?.email}</span>
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.btnApprove}`}
                                                    onClick={() => handleAction(event._id, 'Approve')}
                                                    title="Approve"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.btnReject}`}
                                                    onClick={() => handleAction(event._id, 'Reject')}
                                                    title="Reject"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EventApprovals;
