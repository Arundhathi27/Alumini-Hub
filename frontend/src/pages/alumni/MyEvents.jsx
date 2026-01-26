import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, X, Save } from 'lucide-react';
import { eventService } from '../../services/eventService';
import Sidebar from '../../components/alumni/Sidebar';
import Topbar from '../../components/alumni/Topbar';
import dashboardStyles from './AlumniDashboard.module.css';
import ProfileStyles from './ProfilePage.module.css'; // Reuse form styles

const EventDetailsModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', borderRadius: '0.5rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{event.title}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Event Type</strong>
                    <div>{event.type}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Date & Time</strong>
                    <div>{event.date} at {event.time}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Mode</strong>
                    <div>{event.mode} {event.mode === 'Offline' && `- ${event.location}`}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Description</strong>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{event.description}</div>
                </div>
                {event.link && (
                    <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Link</strong>
                        <a href={event.link} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5' }}>{event.link}</a>
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button onClick={onClose} className={dashboardStyles.btnOutline} style={{ width: 'auto' }}>Close</button>
                </div>
            </div>
        </div>
    );
};

const EditEventModal = ({ event, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: event.title || '',
        type: event.type || 'Webinar',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        mode: event.mode || 'Online',
        location: event.location || '',
        link: event.link || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await eventService.updateEvent(event._id, formData);
            onUpdate(); // Trigger refresh in parent
            onClose();
            alert('Event updated successfully!');
        } catch (error) {
            alert('Failed to update event: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', borderRadius: '0.5rem', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Edit Event</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <form className={ProfileStyles.formGrid} onSubmit={handleSubmit} style={{ marginTop: 0 }}>
                    <div className={ProfileStyles.formGroup}>
                        <label className={ProfileStyles.label}>Event Title</label>
                        <input name="title" className={ProfileStyles.input} value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className={ProfileStyles.formGroup}>
                        <label className={ProfileStyles.label}>Type</label>
                        <select name="type" className={ProfileStyles.select} value={formData.type} onChange={handleChange}>
                            <option value="Webinar">Webinar</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Meetup">Meetup</option>
                            <option value="Alumni Meet">Alumni Meet</option>
                        </select>
                    </div>
                    <div className={ProfileStyles.formGroup}>
                        <label className={ProfileStyles.label}>Date</label>
                        <input type="date" name="date" className={ProfileStyles.input} value={formData.date} onChange={handleChange} required />
                    </div>
                    <div className={ProfileStyles.formGroup}>
                        <label className={ProfileStyles.label}>Time</label>
                        <input type="time" name="time" className={ProfileStyles.input} value={formData.time} onChange={handleChange} required />
                    </div>
                    <div className={ProfileStyles.formGroup}>
                        <label className={ProfileStyles.label}>Mode</label>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" name="mode" value="Online" checked={formData.mode === 'Online'} onChange={handleChange} /> Online
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" name="mode" value="Offline" checked={formData.mode === 'Offline'} onChange={handleChange} /> Offline
                            </label>
                        </div>
                    </div>
                    {formData.mode === 'Offline' && (
                        <div className={ProfileStyles.formGroup}>
                            <label className={ProfileStyles.label}>Location</label>
                            <input name="location" className={ProfileStyles.input} value={formData.location} onChange={handleChange} required />
                        </div>
                    )}
                    <div className={`${ProfileStyles.formGroup} ${ProfileStyles.fullWidth}`}>
                        <label className={ProfileStyles.label}>Link</label>
                        <input type="url" name="link" className={ProfileStyles.input} value={formData.link} onChange={handleChange} placeholder="https://" />
                    </div>
                    <div className={`${ProfileStyles.formGroup} ${ProfileStyles.fullWidth}`}>
                        <label className={ProfileStyles.label}>Description</label>
                        <textarea name="description" className={ProfileStyles.textarea} value={formData.description} onChange={handleChange} required rows="4" />
                    </div>

                    <div className={ProfileStyles.buttonGroup}>
                        <button type="button" className={ProfileStyles.btnSecondary} onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" className={ProfileStyles.btnPrimary} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MyEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewEvent, setViewEvent] = useState(null);
    const [editEvent, setEditEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

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

    return (
        <>
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
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className={dashboardStyles.btnOutline}
                                                onClick={() => setViewEvent(event)}
                                                title="View"
                                                style={{ padding: '0.4rem' }}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className={dashboardStyles.btnOutline}
                                                onClick={() => setEditEvent(event)}
                                                title="Edit"
                                                disabled={event.status !== 'Pending'}
                                                style={{
                                                    padding: '0.4rem',
                                                    opacity: event.status !== 'Pending' ? 0.5 : 1,
                                                    cursor: event.status !== 'Pending' ? 'not-allowed' : 'pointer',
                                                    color: event.status === 'Pending' ? '#0284c7' : 'inherit',
                                                    borderColor: event.status === 'Pending' ? '#0284c7' : 'inherit'
                                                }}
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {viewEvent && <EventDetailsModal event={viewEvent} onClose={() => setViewEvent(null)} />}
            {editEvent && <EditEventModal event={editEvent} onClose={() => setEditEvent(null)} onUpdate={fetchEvents} />}
        </>
    );
};

export default MyEvents;
