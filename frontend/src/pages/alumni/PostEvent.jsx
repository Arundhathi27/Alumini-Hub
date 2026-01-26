import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { Save, X, Calendar, MapPin, Link as LinkIcon, Clock } from 'lucide-react'; // Added icons
import { motion } from 'framer-motion';
import Sidebar from '../../components/alumni/Sidebar';
import Topbar from '../../components/alumni/Topbar';
import dashboardStyles from './AlumniDashboard.module.css';
import styles from './ProfilePage.module.css'; // Reusing form styles (matches PostJob)

const PostEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        type: 'Webinar',
        description: '',
        date: '',
        time: '',
        mode: 'Online',
        location: '',
        link: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await eventService.createEvent(formData);
            alert('Event posted successfully! It is pending approval.');
            navigate('/alumni/my-events');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.container}
        >
            {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>{error}</div>}

            <form className={styles.formGrid} onSubmit={handleSubmit} style={{ marginTop: 0 }}>
                <div className={`${styles.sectionTitle} ${styles.fullWidth}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={20} /> Event Details
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Event Title</label>
                    <input
                        type="text"
                        name="title"
                        className={styles.input}
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. React.js Masterclass"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Event Type</label>
                    <select
                        name="type"
                        className={styles.select}
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="Webinar">Webinar</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Meetup">Meetup</option>
                        <option value="Alumni Meet">Alumni Meet</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Date</label>
                    <input
                        type="date"
                        name="date"
                        className={styles.input}
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Time</label>
                    <input
                        type="time"
                        name="time"
                        className={styles.input}
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Mode</label>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="mode"
                                value="Online"
                                checked={formData.mode === 'Online'}
                                onChange={handleChange}
                            /> Online
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="mode"
                                value="Offline"
                                checked={formData.mode === 'Offline'}
                                onChange={handleChange}
                            /> Offline
                        </label>
                    </div>
                </div>

                {/* Location (Conditional) */}
                {formData.mode === 'Offline' && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Location / Venue</label>
                        <input
                            type="text"
                            name="location"
                            className={styles.input}
                            value={formData.location}
                            onChange={handleChange}
                            required={formData.mode === 'Offline'}
                            placeholder="e.g. Conference Hall A"
                        />
                    </div>
                )}

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Reference / Registration Link</label>
                    <input
                        type="url"
                        name="link"
                        className={styles.input}
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="https://"
                    />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Description</label>
                    <textarea
                        name="description"
                        className={styles.textarea}
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                    />
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={styles.btnSecondary}
                        onClick={() => navigate('/alumni/dashboard')}
                        disabled={loading}
                    >
                        <X size={18} /> Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.btnPrimary}
                        disabled={loading}
                    >
                        <Save size={18} /> {loading ? 'Posting...' : 'Post Event'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default PostEvent;
