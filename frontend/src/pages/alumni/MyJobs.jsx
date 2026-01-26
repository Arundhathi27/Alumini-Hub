import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Edit, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/alumni/Sidebar';
import Topbar from '../../components/alumni/Topbar';
import dashboardStyles from './AlumniDashboard.module.css';
import ProfileStyles from './ProfilePage.module.css'; // Reuse form styles
import { jobService } from '../../services/jobService';

const JobDetailsModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', borderRadius: '0.5rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{job.title}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Company & Type</strong>
                    <div>{job.company} • {job.type}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Location</strong>
                    <div>{job.location}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Role</strong>
                    <div>{job.role}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Experience</strong>
                    <div>{job.experience}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Skills</strong>
                    <div>{job.skills && job.skills.join(', ')}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Description</strong>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{job.description}</div>
                </div>
                {job.applyLink && (
                    <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.875rem' }}>Application Link</strong>
                        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5' }}>{job.applyLink}</a>
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button onClick={onClose} className={dashboardStyles.btnOutline} style={{ width: 'auto' }}>Close</button>
                </div>
            </div>
        </div>
    );
};

const EditJobModal = ({ job, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: job.title || '',
        company: job.company || '',
        role: job.role || '',
        type: job.type || 'Full-time',
        location: job.location || '',
        skills: job.skills ? job.skills.join(', ') : '',
        experience: job.experience || '',
        description: job.description || '',
        applyLink: job.applyLink || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            };
            await jobService.updateJob(job._id, updatedData);
            onUpdate(); // Trigger refresh in parent
            onClose();
            alert('Job updated successfully!');
        } catch (error) {
            alert('Failed to update job: ' + (error.response?.data?.message || 'Unknown error'));
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
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Edit Job</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <form className={ProfileStyles.formGrid} onSubmit={handleSubmit} style={{ marginTop: 0 }}>
                    {/* Reuse simplified form fields */}
                    <div className={ProfileStyles.formGroup}>
                        <label className={ProfileStyles.label}>Job Title</label>
                        <input name="title" className={ProfileStyles.input} value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className={ProfileStyles.formGroup}>
                        <label className={ProfileStyles.label}>Company</label>
                        <input name="company" className={ProfileStyles.input} value={formData.company} onChange={handleChange} required />
                    </div>
                    <div className={ProfileStyles.formGroup}>
                        <label className={ProfileStyles.label}>Role</label>
                        <input name="role" className={ProfileStyles.input} value={formData.role} onChange={handleChange} required />
                    </div>
                    <div className={ProfileStyles.formGroup}>
                        <label className={ProfileStyles.label}>Type</label>
                        <select name="type" className={ProfileStyles.select} value={formData.type} onChange={handleChange}>
                            <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
                        </select>
                    </div>
                    <div className={ProfileStyles.formGroup}>
                        <label className={ProfileStyles.label}>Location</label>
                        <input name="location" className={ProfileStyles.input} value={formData.location} onChange={handleChange} required />
                    </div>
                    <div className={ProfileStyles.formGroup}>
                        <label className={ProfileStyles.label}>Experience</label>
                        <input name="experience" className={ProfileStyles.input} value={formData.experience} onChange={handleChange} required />
                    </div>
                    <div className={`${ProfileStyles.formGroup} ${ProfileStyles.fullWidth}`}>
                        <label className={ProfileStyles.label}>Skills (Comma separated)</label>
                        <input name="skills" className={ProfileStyles.input} value={formData.skills} onChange={handleChange} required />
                    </div>
                    <div className={`${ProfileStyles.formGroup} ${ProfileStyles.fullWidth}`}>
                        <label className={ProfileStyles.label}>Description</label>
                        <textarea name="description" className={ProfileStyles.textarea} value={formData.description} onChange={handleChange} required rows="4" />
                    </div>
                    <div className={`${ProfileStyles.formGroup} ${ProfileStyles.fullWidth}`}>
                        <label className={ProfileStyles.label}>Link</label>
                        <input name="applyLink" className={ProfileStyles.input} value={formData.applyLink} onChange={handleChange} required />
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

const MyJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewJob, setViewJob] = useState(null);
    const [editJob, setEditJob] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await jobService.getMyJobs();
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <button
                    className={dashboardStyles.btnPrimary}
                    onClick={() => navigate('/alumni/post-job')}
                >
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> Post New Job
                </button>
            </div>

            <div className={dashboardStyles.tableContainer}>
                <table className={dashboardStyles.table}>
                    <thead>
                        <tr className={dashboardStyles.tr}>
                            <th className={dashboardStyles.th}>Job Title</th>
                            <th className={dashboardStyles.th}>Company</th>
                            <th className={dashboardStyles.th}>Posted Date</th>
                            <th className={dashboardStyles.th}>Status</th>
                            <th className={dashboardStyles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className={dashboardStyles.td} style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : jobs.length === 0 ? (
                            <tr><td colSpan="5" className={dashboardStyles.td} style={{ textAlign: 'center' }}>No jobs posted yet.</td></tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job._id} className={dashboardStyles.tr}>
                                    <td className={dashboardStyles.td} style={{ fontWeight: 500 }}>{job.title}</td>
                                    <td className={dashboardStyles.td}>{job.company}</td>
                                    <td className={dashboardStyles.td}>{new Date(job.createdAt).toLocaleDateString()}</td>
                                    <td className={dashboardStyles.td}>
                                        <span className={`${dashboardStyles.badge} ${job.status === 'Approved' ? dashboardStyles.badgeApproved :
                                            job.status === 'Pending' ? dashboardStyles.badgePending :
                                                dashboardStyles.badgeRejected
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className={dashboardStyles.td}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className={dashboardStyles.btnOutline}
                                                onClick={() => setViewJob(job)}
                                                title="View"
                                                style={{ padding: '0.4rem' }}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className={dashboardStyles.btnOutline}
                                                onClick={() => setEditJob(job)}
                                                title="Edit"
                                                disabled={job.status !== 'Pending'}
                                                style={{
                                                    padding: '0.4rem',
                                                    opacity: job.status !== 'Pending' ? 0.5 : 1,
                                                    cursor: job.status !== 'Pending' ? 'not-allowed' : 'pointer',
                                                    color: job.status === 'Pending' ? '#0284c7' : 'inherit',
                                                    borderColor: job.status === 'Pending' ? '#0284c7' : 'inherit'
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

            {viewJob && <JobDetailsModal job={viewJob} onClose={() => setViewJob(null)} />}
            {editJob && <EditJobModal job={editJob} onClose={() => setEditJob(null)} onUpdate={fetchJobs} />}
        </>
    );
};

export default MyJobs;
