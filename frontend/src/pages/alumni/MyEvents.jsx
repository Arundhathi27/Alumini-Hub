import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { eventService } from '../../services/eventService';
import Sidebar from '../../components/alumni/Sidebar';
import Topbar from '../../components/alumni/Topbar';
import dashboardStyles from './AlumniDashboard.module.css';

const MyEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await eventService.getMyEvents();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className={dashboardStyles.layout}>
            <Sidebar />
            <div className={dashboardStyles.mainWrapper}>
                <Topbar title="My Posted Events" />
                <main className={dashboardStyles.content}>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <button
                            className={dashboardStyles.btnPrimary}
                            onClick={() => navigate('/alumni/post-event')}
                        >
                            <Plus size={18} style={{ marginRight: '0.5rem' }} /> Host New Event
                        </button>
                    </div>

                    <div className={dashboardStyles.tableContainer}>
                        <table className={dashboardStyles.table}>
                            <thead>
                                <tr className={dashboardStyles.tr}>
                                    <th className={dashboardStyles.th}>Event Title</th>
                                    <th className={dashboardStyles.th}>Type</th>
                                    <th className={dashboardStyles.th}>Date & Time</th>
                                    <th className={dashboardStyles.th}>Mode</th>
                                    <th className={dashboardStyles.th}>Status</th>
                                    <th className={dashboardStyles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className={dashboardStyles.td} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                                ) : events.length === 0 ? (
                                    <tr><td colSpan="6" className={dashboardStyles.td} style={{ textAlign: 'center', padding: '2rem' }}>No events posted yet.</td></tr>
                                ) : (
                                    events.map((event) => (
                                        <tr key={event._id} className={dashboardStyles.tr}>
                                            <td className={dashboardStyles.td} style={{ fontWeight: 500 }}>{event.title}</td>
                                            <td className={dashboardStyles.td}>{event.type}</td>
                                            <td className={dashboardStyles.td}>
                                                {event.date} <br />
                                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{event.time}</span>
                                            </td>
                                            <td className={dashboardStyles.td}>{event.mode} {event.mode === 'Offline' && `(${event.location})`}</td>
                                            <td className={dashboardStyles.td}>
                                                <span className={`${dashboardStyles.badge} ${event.status === 'Approved' ? dashboardStyles.badgeApproved :
                                                        event.status === 'Pending' ? dashboardStyles.badgePending :
                                                            dashboardStyles.badgeRejected
                                                    }`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className={dashboardStyles.td}>
                                                <button className={dashboardStyles.btnOutline} disabled>View</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyEvents;
