import React, { useState, useEffect } from 'react';
import { Check, X, Eye } from 'lucide-react';
import dashboardStyles from '../alumni/AlumniDashboard.module.css'; // Use shared styles
import { adminJobService } from '../../services/adminJobService';
import { useNotifications } from '../../context/NotificationContext';

const JobApprovals = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');
    const { markByTypeAsRead } = useNotifications();

    useEffect(() => {
        markByTypeAsRead('job_status');
        fetchJobs();
    }, [filter]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await adminJobService.getAllJobs(filter === 'All' ? '' : filter);
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            // alert('Error fetching jobs: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this job?`)) return;
        try {
            await adminJobService.updateJobStatus(id, status);
            fetchJobs(); // Refresh list
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <div style={{ padding: '1rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>Job Approvals</h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="All">All Jobs</option>
                </select>
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
                            <tr><td colSpan="6" className={dashboardStyles.td} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                        ) : jobs.length === 0 ? (
                            <tr><td colSpan="6" className={dashboardStyles.td} style={{ textAlign: 'center', padding: '2rem' }}>No jobs found.</td></tr>
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
                                            {job.status === 'Pending' && (
                                                <>
                                                    <button
                                                        className={dashboardStyles.btnOutline}
                                                        style={{ color: '#059669', borderColor: '#059669', padding: '0.4rem', borderRadius: '0.375rem' }}
                                                        onClick={() => handleStatusUpdate(job._id, 'Approved')}
                                                        title="Approve"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className={dashboardStyles.btnOutline}
                                                        style={{ color: '#dc2626', borderColor: '#dc2626', padding: '0.4rem', borderRadius: '0.375rem' }}
                                                        onClick={() => handleStatusUpdate(job._id, 'Rejected')}
                                                        title="Reject"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}
                                            <button className={dashboardStyles.btnOutline} style={{ padding: '0.4rem', borderRadius: '0.375rem' }} title="View Details">
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
    );
};

export default JobApprovals;
