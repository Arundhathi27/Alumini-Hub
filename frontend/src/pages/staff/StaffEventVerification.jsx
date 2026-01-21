import React, { useState, useEffect } from 'react';
import { adminEventService } from '../../services/adminEventService';
import styles from '../alumni/AlumniDashboard.module.css'; // Reuse existing styles
import { Check, X, Calendar, Eye } from 'lucide-react';

const EventDetailsModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', borderRadius: '0.5rem', width: '90%', maxWidth: '600px', maxHeight: '90vh',
                overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    padding: '1.5rem', borderBottom: '1px solid #e5e7eb',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Event Details</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>{event.title}</h4>
                        <div style={{ color: '#4b5563', fontWeight: 500 }}>{event.type}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>{event.mode} {event.mode === 'Offline' && `- ${event.location}`}</div>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Date & Time</span>
                            <div style={{ color: '#374151' }}>{event.date} at {event.time}</div>
                        </div>

                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Description</span>
                            <div style={{ color: '#374151', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{event.description}</div>
                        </div>

                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Posted By</span>
                            <div style={{ color: '#374151' }}>
                                {event.postedBy?.name} ({event.postedBy?.email})
                            </div>
                        </div>

                        {event.link && (
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Event Link</span>
                                <a href={event.link} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', textDecoration: 'underline' }}>{event.link}</a>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '0.5rem 1rem', background: '#f3f4f6', color: '#374151', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontWeight: 500, cursor: 'pointer' }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const StaffEventVerification = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);

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
            setEvents(prev => prev.filter(e => e._id !== eventId));
            alert(`Event ${action}ed successfully`);
        } catch (error) {
            alert(`Failed to ${action} event`);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header} style={{ marginBottom: '2rem' }}>
                <h2 className={styles.title}>Pending Event Verifications (Staff)</h2>
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
                                                    style={{ color: '#059669', borderColor: '#059669', padding: '0.4rem', borderRadius: '0.375rem' }}
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.btnReject}`}
                                                    onClick={() => handleAction(event._id, 'Reject')}
                                                    title="Reject"
                                                    style={{ color: '#dc2626', borderColor: '#dc2626', padding: '0.4rem', borderRadius: '0.375rem' }}
                                                >
                                                    <X size={16} />
                                                </button>
                                                <button
                                                    className={styles.btnOutline}
                                                    onClick={() => setSelectedEvent(event)}
                                                    title="View Details"
                                                    style={{ padding: '0.4rem', borderRadius: '0.375rem' }}
                                                >
                                                    <Eye size={16} />
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

            <EventDetailsModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </div>
    );
};

export default StaffEventVerification;
