import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, X, Briefcase } from 'lucide-react';
import Sidebar from '../../components/alumni/Sidebar';
import Topbar from '../../components/alumni/Topbar';
import dashboardStyles from './AlumniDashboard.module.css';
import styles from './ProfilePage.module.css'; // Reusing form styles
import { jobService } from '../../services/jobService';

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        role: '',
        type: 'Full-time',
        location: '',
        skills: '',
        experience: '',
        description: '',
        applyLink: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Parse skills string to array
            const jobData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            };

            await jobService.createJob(jobData);
            alert('Job posted successfully! Pending approval.');
            navigate('/alumni/posts');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to post job');
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
            <form className={styles.formGrid} onSubmit={handleSubmit} style={{ marginTop: 0 }}>
                <div className={`${styles.sectionTitle} ${styles.fullWidth}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={20} /> Job Details
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Job Title</label>
                    <input
                        name="title"
                        className={styles.input}
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Senior React Developer"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Company Name</label>
                    <input
                        name="company"
                        className={styles.input}
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Google"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Job Role / Designation</label>
                    <input
                        name="role"
                        className={styles.input}
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="e.g. Frontend Engineer"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Job Type</label>
                    <select
                        name="type"
                        className={styles.select}
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Internship</option>
                        <option>Contract</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Location</label>
                    <input
                        name="location"
                        className={styles.input}
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Bangalore, Remote"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Experience Required</label>
                    <input
                        name="experience"
                        className={styles.input}
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="e.g. 2-4 Years"
                        required
                    />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Required Skills (Comma separated)</label>
                    <input
                        name="skills"
                        className={styles.input}
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React, Node.js, MongoDB..."
                        required
                    />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Job Description</label>
                    <textarea
                        name="description"
                        className={styles.textarea}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the role and responsibilities..."
                        required
                    />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Application Link or Email</label>
                    <input
                        name="applyLink"
                        className={styles.input}
                        value={formData.applyLink}
                        onChange={handleChange}
                        placeholder="https://... or email@example.com"
                        required
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
                        <Save size={18} /> {loading ? 'Posting...' : 'Post Job'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default PostJob;
