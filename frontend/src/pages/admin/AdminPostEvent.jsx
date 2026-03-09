import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminEventService } from '../../services/adminEventService';
import { Save, X, Calendar, MapPin, Link as LinkIcon, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AdminDashboard.module.css';

const InputField = ({ label, icon: Icon, children }) => (
    <div className={styles.formGroup}>
        <label className={styles.formLabel} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {Icon && <Icon size={13} color="#6b7280" />} {label}
        </label>
        {children}
    </div>
);

const AdminPostEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '', type: 'Webinar', description: '',
        date: '', time: '', mode: 'Online', location: '', link: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await adminEventService.createAdminEvent(formData);
            setSuccess('Event published successfully! Redirecting...');
            setTimeout(() => navigate('/admin/event-approvals'), 2200);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Page Header */}
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '1.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 36, height: 36, background: '#faf5ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={18} color="#7c3aed" />
                    </div>
                    Post New Event
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.3rem' }}>Create and instantly publish an event for all users.</p>
            </motion.div>

            {/* Alerts */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '0.625rem', padding: '0.875rem 1.125rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem' }}>
                        <AlertCircle size={16} /> {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: '0.625rem', padding: '0.875rem 1.125rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem' }}>
                        <CheckCircle size={16} /> {success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Admin Instant Publish Notice */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ background: 'linear-gradient(135deg,#eff6ff,#e0e7ff)', border: '1px solid #bfdbfe', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 32, height: 32, background: '#2563eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={15} color="#fff" fill="#fff" />
                </div>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                    <strong>Admin Publish</strong> — Your event will be <strong>immediately live</strong> for all users. No approval required.
                </p>
            </motion.div>

            {/* Form Card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #f0f0f5', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <InputField label="Event Title" icon={Calendar}>
                            <input type="text" name="title" className={styles.formInput}
                                value={formData.title} onChange={handleChange} required
                                placeholder="e.g. React.js Masterclass" />
                        </InputField>

                        <InputField label="Event Type">
                            <select name="type" className={styles.formSelect} value={formData.type} onChange={handleChange}>
                                <option value="Webinar">Webinar</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Meetup">Meetup</option>
                                <option value="Alumni Meet">Alumni Meet</option>
                            </select>
                        </InputField>

                        <InputField label="Date" icon={Calendar}>
                            <input type="date" name="date" className={styles.formInput}
                                value={formData.date} onChange={handleChange} required />
                        </InputField>

                        <InputField label="Time" icon={Clock}>
                            <input type="time" name="time" className={styles.formInput}
                                value={formData.time} onChange={handleChange} required />
                        </InputField>

                        {/* Mode Toggle */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className={styles.formLabel}>Mode</label>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                {['Online', 'Offline'].map(mode => (
                                    <motion.label key={mode} whileHover={{ scale: 1.02 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', border: `2px solid ${formData.mode === mode ? '#2563eb' : '#e5e7eb'}`, background: formData.mode === mode ? '#eff6ff' : '#fff', color: formData.mode === mode ? '#2563eb' : '#374151', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.18s' }}>
                                        <input type="radio" name="mode" value={mode} checked={formData.mode === mode} onChange={handleChange} style={{ display: 'none' }} />
                                        {mode === 'Online' ? <LinkIcon size={14} /> : <MapPin size={14} />} {mode}
                                    </motion.label>
                                ))}
                            </div>
                        </div>

                        <AnimatePresence>
                            {formData.mode === 'Offline' && (
                                <motion.div key="location" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    style={{ gridColumn: '1 / -1' }}>
                                    <InputField label="Location / Venue" icon={MapPin}>
                                        <input type="text" name="location" className={styles.formInput}
                                            value={formData.location} onChange={handleChange}
                                            required={formData.mode === 'Offline'} placeholder="e.g. Conference Hall A, Main Campus" />
                                    </InputField>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <InputField label="Registration / Reference Link" icon={LinkIcon}>
                                <input type="url" name="link" className={styles.formInput}
                                    value={formData.link} onChange={handleChange} placeholder="https://" />
                            </InputField>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <InputField label="Description">
                                <textarea name="description" className={styles.formTextarea}
                                    value={formData.description} onChange={handleChange} required rows="5"
                                    placeholder="Describe the event, what attendees can expect, speakers, agenda..." />
                            </InputField>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f0f0f5' }}>
                        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/admin/event-approvals')} disabled={loading}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', border: '1.5px solid #e5e7eb', borderRadius: '0.5rem', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
                            <X size={16} /> Cancel
                        </motion.button>
                        <motion.button type="submit" whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} disabled={loading}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(37,99,235,0.35)', opacity: loading ? 0.75 : 1 }}>
                            {loading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%' }} />
                            ) : <Save size={16} />}
                            {loading ? 'Publishing...' : 'Publish Event'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AdminPostEvent;
