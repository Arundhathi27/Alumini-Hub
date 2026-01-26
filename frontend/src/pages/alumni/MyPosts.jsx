import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { eventService } from '../../services/eventService';
import dashboardStyles from './AlumniDashboard.module.css';

const MyPosts = () => {
    const [activeTab, setActiveTab] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [jobsData, eventsData] = await Promise.all([
                jobService.getMyJobs(),
                eventService.getMyEvents()
            ]);

            // Filter only approved
            setJobs(jobsData.filter(job => job.status === 'Approved'));
            setEvents(eventsData.filter(event => event.status === 'Approved'));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>My Approved Posts</h2>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                borderBottom: '2px solid #e5e7eb'
            }}>
                <button
                    onClick={() => setActiveTab('jobs')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 500,
                        borderBottom: activeTab === 'jobs' ? '2px solid #4f46e5' : '2px solid transparent',
                        color: activeTab === 'jobs' ? '#4f46e5' : '#6b7280',
                        transition: 'all 0.2s'
                    }}
                >
                    <Briefcase size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Jobs ({jobs.length})
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 500,
                        borderBottom: activeTab === 'events' ? '2px solid #4f46e5' : '2px solid transparent',
                        color: activeTab === 'events' ? '#4f46e5' : '#6b7280',
                        transition: 'all 0.2s'
                    }}
                >
                    <Calendar size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Events ({events.length})
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading...</div>
            ) : (
                <>
                    {activeTab === 'jobs' && (
                        <div className={dashboardStyles.tableContainer}>
                            {jobs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                    No approved jobs yet.
                                </div>
                            ) : (
                                <table className={dashboardStyles.table}>
                                    <thead>
                                        <tr className={dashboardStyles.tr}>
                                            <th className={dashboardStyles.th}>Job Title</th>
                                            <th className={dashboardStyles.th}>Company</th>
                                            <th className={dashboardStyles.th}>Location</th>
                                            <th className={dashboardStyles.th}>Type</th>
                                            <th className={dashboardStyles.th}>Posted Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.map((job) => (
                                            <tr key={job._id} className={dashboardStyles.tr}>
                                                <td className={dashboardStyles.td} style={{ fontWeight: 500 }}>{job.title}</td>
                                                <td className={dashboardStyles.td}>{job.company}</td>
                                                <td className={dashboardStyles.td}>{job.location}</td>
                                                <td className={dashboardStyles.td}>
                                                    <span className={`${dashboardStyles.badge} ${dashboardStyles.badgeApproved}`}>
                                                        {job.type}
                                                    </span>
                                                </td>
                                                <td className={dashboardStyles.td}>{new Date(job.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className={dashboardStyles.tableContainer}>
                            {events.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                    No approved events yet.
                                </div>
                            ) : (
                                <table className={dashboardStyles.table}>
                                    <thead>
                                        <tr className={dashboardStyles.tr}>
                                            <th className={dashboardStyles.th}>Event Title</th>
                                            <th className={dashboardStyles.th}>Type</th>
                                            <th className={dashboardStyles.th}>Date & Time</th>
                                            <th className={dashboardStyles.th}>Mode</th>
                                            <th className={dashboardStyles.th}>Posted Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map((event) => (
                                            <tr key={event._id} className={dashboardStyles.tr}>
                                                <td className={dashboardStyles.td} style={{ fontWeight: 500 }}>{event.title}</td>
                                                <td className={dashboardStyles.td}>{event.type}</td>
                                                <td className={dashboardStyles.td}>
                                                    {event.date} <br />
                                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{event.time}</span>
                                                </td>
                                                <td className={dashboardStyles.td}>
                                                    <span className={`${dashboardStyles.badge} ${dashboardStyles.badgeApproved}`}>
                                                        {event.mode}
                                                    </span>
                                                </td>
                                                <td className={dashboardStyles.td}>{new Date(event.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default MyPosts;
