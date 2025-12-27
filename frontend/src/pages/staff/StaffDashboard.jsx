import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Calendar, CheckSquare, Briefcase } from 'lucide-react';
import Sidebar from '../../components/staff/Sidebar';
import Topbar from '../../components/staff/Topbar';
import styles from './StaffDashboard.module.css';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
        className={styles.card}
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <p className={styles.statLabel}>{label}</p>
                <p className={styles.statValue}>{value}</p>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: color, color: 'white' }}>
                <Icon size={24} />
            </div>
        </div>
    </motion.div>
);

const StaffDashboard = () => {
    // Mock Data
    const pendingJobVerifications = [
        { id: 101, company: "Google", role: "Software Engineer", postedBy: "John Alumni", status: "Pending" },
        { id: 102, company: "Amazon", role: "Data Scientist", postedBy: "Sarah Alumni", status: "Pending" },
        { id: 103, company: "StartUp Inc", role: "Frontend Dev", postedBy: "Mike Alumni", status: "Pending" },
    ];

    const pendingEventVerifications = [
        { id: 201, name: "Tech Talk 2025", date: "2025-08-10", postedBy: "David Alumni", status: "Pending" },
        { id: 202, name: "Alumni Meetup", date: "2025-09-01", postedBy: "Lisa Alumni", status: "Pending" },
    ];

    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Topbar title="Staff Dashboard" />

                <main className={styles.content}>
                    {/* Statistics Section */}
                    <div className={styles.statsGrid}>
                        <StatCard icon={Users} label="Total Alumni" value="1,240" color="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" />
                        <StatCard icon={CheckSquare} label="Pending Job Verifications" value="15" color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" />
                        <StatCard icon={Calendar} label="Pending Event Verifications" value="8" color="linear-gradient(135deg, #ec4899 0%, #db2777 100%)" />
                        <StatCard icon={Briefcase} label="Approved Jobs" value="450" color="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

                        {/* Pending Job Verification Table */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Pending Job Verifications</h3>
                                <button className={styles.linkButton}>View All <FileText size={16} style={{ marginLeft: 8 }} /></button>
                            </div>

                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr className={styles.tr}>
                                            <th className={styles.th}>Company</th>
                                            <th className={styles.th}>Role</th>
                                            <th className={styles.th}>Posted By</th>
                                            <th className={styles.th}>Status</th>
                                            <th className={styles.th}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingJobVerifications.map((job) => (
                                            <tr key={job.id} className={styles.tr}>
                                                <td className={styles.td} style={{ fontWeight: 500 }}>{job.company}</td>
                                                <td className={styles.td}>{job.role}</td>
                                                <td className={styles.td}>{job.postedBy}</td>
                                                <td className={styles.td}>
                                                    <span className={`${styles.badge} ${styles.badgePending}`}>{job.status}</span>
                                                </td>
                                                <td className={styles.td}>
                                                    <button className={`${styles.actionBtn} ${styles.btnApprove}`}>Approve</button>
                                                    <button className={`${styles.actionBtn} ${styles.btnReject}`}>Reject</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pending Event Verification Table */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Pending Event Verifications</h3>
                                <button className={styles.linkButton}>View All <Calendar size={16} style={{ marginLeft: 8 }} /></button>
                            </div>

                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr className={styles.tr}>
                                            <th className={styles.th}>Event Name</th>
                                            <th className={styles.th}>Date</th>
                                            <th className={styles.th}>Posted By</th>
                                            <th className={styles.th}>Status</th>
                                            <th className={styles.th}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingEventVerifications.map((event) => (
                                            <tr key={event.id} className={styles.tr}>
                                                <td className={styles.td} style={{ fontWeight: 500 }}>{event.name}</td>
                                                <td className={styles.td}>{event.date}</td>
                                                <td className={styles.td}>{event.postedBy}</td>
                                                <td className={styles.td}>
                                                    <span className={`${styles.badge} ${styles.badgePending}`}>{event.status}</span>
                                                </td>
                                                <td className={styles.td}>
                                                    <button className={`${styles.actionBtn} ${styles.btnApprove}`}>Approve</button>
                                                    <button className={`${styles.actionBtn} ${styles.btnReject}`}>Reject</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div style={{ marginTop: '1rem' }}>
                            <h3 className={styles.sectionTitle}>Quick Actions</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button className={styles.linkButton}>View Alumni Directory</button>
                                <button className={styles.linkButton}>View Approved Jobs</button>
                                <button className={styles.linkButton}>View Approved Events</button>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default StaffDashboard;
