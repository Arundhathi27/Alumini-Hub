import React, { useState, useEffect } from 'react';
import { Check, X, Eye } from 'lucide-react';
import dashboardStyles from '../alumni/AlumniDashboard.module.css';
import { adminJobService } from '../../services/adminJobService';

const JobDetailsModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '0.5rem',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Job Details</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>{job.title}</h4>
                        <div style={{ color: '#4b5563', fontWeight: 500 }}>{job.company} • {job.type}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>{job.location}</div>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', tracking: 'wide' }}>Role</span>
                            <div style={{ color: '#374151' }}>{job.role}</div>
                        </div>

                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', tracking: 'wide' }}>Description</span>
                            <div style={{ color: '#374151', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{job.description}</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', tracking: 'wide' }}>Experience</span>
                                <div style={{ color: '#374151' }}>{job.experience}</div>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', tracking: 'wide' }}>Skills</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    {job.skills && job.skills.map((skill, index) => (
                                        <span key={index} style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', tracking: 'wide' }}>Posted By</span>
                            <div style={{ color: '#374151' }}>
                                {job.postedBy?.name} ({job.postedBy?.email})
                            </div>
                        </div>

                        {job.applyLink && (
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', tracking: 'wide' }}>Application Link</span>
                                <a href={job.applyLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', textDecoration: 'underline' }}>{job.applyLink}</a>
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

const StaffJobVerification = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchPendingJobs();
    }, []);

    const fetchPendingJobs = async () => {
        setLoading(true);
        try {
            const data = await adminJobService.getPendingJobs();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching pending jobs:', error);
            // alert('Error: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (jobId, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this job?`)) return;
        try {
            await adminJobService.verifyJob(jobId, action);
            fetchPendingJobs(); // Refresh list
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <div style={{ padding: '1rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>Job Verification</h2>
            </div>

            <div className={dashboardStyles.tableContainer} style={{ width: '100%' }}>
                <table className={dashboardStyles.table} style={{ width: '100%' }}>
                    <thead>
                        <tr className={dashboardStyles.tr}>
                            <th className={dashboardStyles.th}>Job Title</th>
                            <th className={dashboardStyles.th}>Company</th>
                            <th className={dashboardStyles.th}>Posted By</th>
                            <th className={dashboardStyles.th}>Location</th>
                            <th className={dashboardStyles.th}>Date</th>
                            <th className={dashboardStyles.th}>Status</th>
                            <th className={dashboardStyles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className={dashboardStyles.td} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                        ) : jobs.length === 0 ? (
                            <tr><td colSpan="7" className={dashboardStyles.td} style={{ textAlign: 'center', padding: '2rem' }}>No pending jobs.</td></tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job._id} className={dashboardStyles.tr}>
                                    <td className={dashboardStyles.td} style={{ fontWeight: 500 }}>{job.title}</td>
                                    <td className={dashboardStyles.td}>{job.company}</td>
                                    <td className={dashboardStyles.td}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 500 }}>{job.postedBy?.name || 'Unknown'}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{job.postedBy?.email}</span>
                                        </div>
                                    </td>
                                    <td className={dashboardStyles.td}>{job.location}</td>
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
                                                style={{ color: '#059669', borderColor: '#059669', padding: '0.4rem', borderRadius: '0.375rem' }}
                                                onClick={() => handleAction(job._id, 'Approve')}
                                                title="Approve"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                className={dashboardStyles.btnOutline}
                                                style={{ color: '#dc2626', borderColor: '#dc2626', padding: '0.4rem', borderRadius: '0.375rem' }}
                                                onClick={() => handleAction(job._id, 'Reject')}
                                                title="Reject"
                                            >
                                                <X size={16} />
                                            </button>
                                            <button
                                                className={dashboardStyles.btnOutline}
                                                style={{ padding: '0.4rem', borderRadius: '0.375rem' }}
                                                title="View Details"
                                                onClick={() => setSelectedJob(job)}
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
            <JobDetailsModal
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
            />
        </div>
    );
};

export default StaffJobVerification;
