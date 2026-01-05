import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import
import Sidebar from '../../components/alumni/Sidebar';
import Topbar from '../../components/alumni/Topbar';
import dashboardStyles from './AlumniDashboard.module.css';
import { jobService } from '../../services/jobService';

const MyJobs = () => {
    const navigate = useNavigate(); // Add this hook
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <div className={dashboardStyles.layout}>
            <Sidebar />
            <div className={dashboardStyles.mainWrapper}>
                <Topbar title="My Job Posts" />
                <main className={dashboardStyles.content}>

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

export default MyJobs;
