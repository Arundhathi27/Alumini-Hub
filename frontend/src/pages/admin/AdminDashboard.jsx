import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, FileText, Calendar } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import styles from './AdminDashboard.module.css';

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
            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: color, color: 'white' }}>
                <Icon size={24} />
            </div>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    // Mock Data
    const pendingAlumni = [
        { id: 1, name: "John Doe", email: "john@example.com", batch: "2023", status: "Pending" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", batch: "2022", status: "Pending" },
    ];

    const pendingJobs = [
        { id: 1, company: "TechCorp", role: "Software Engineer", postedBy: "Alice (Alumni)", status: "Pending" },
        { id: 2, company: "Innovate Inc", role: "Product Manager", postedBy: "Bob (Alumni)", status: "Pending" },
    ];

    const pendingEvents = [
        { id: 1, name: "Alumni Meetup 2025", date: "2025-06-15", postedBy: "Alice (Alumni)", status: "Pending" },
    ];

    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Topbar title="Dashboard Overview" />

                <main className={styles.content}>
                    {/* Statistics Section */}
                    <div className={styles.statsGrid}>
                        <StatCard icon={Users} label="Total Alumni" value="1,240" color="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" />
                        <StatCard icon={UserPlus} label="Pending Approvals" value="12" color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" />
                        <StatCard icon={FileText} label="Pending Jobs" value="8" color="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
                        <StatCard icon={Calendar} label="Pending Events" value="5" color="linear-gradient(135deg, #ec4899 0%, #db2777 100%)" />
                    </div>

                    {/* Pending Alumni Table */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 className={styles.sectionTitle}>Pending Alumni Verifications</h3>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.tr}>
                                        <th className={styles.th}>Name</th>
                                        <th className={styles.th}>Email</th>
                                        <th className={styles.th}>Batch</th>
                                        <th className={styles.th}>Status</th>
                                        <th className={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingAlumni.map((alum) => (
                                        <tr key={alum.id} className={styles.tr}>
                                            <td className={styles.td}>{alum.name}</td>
                                            <td className={styles.td}>{alum.email}</td>
                                            <td className={styles.td}>{alum.batch}</td>
                                            <td className={styles.td}>
                                                <span className={`${styles.badge} ${styles.badgePending}`}>{alum.status}</span>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Pending Jobs */}
                        <div>
                            <h3 className={styles.sectionTitle}>Pending Job Posts</h3>
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr className={styles.tr}>
                                            <th className={styles.th}>Company</th>
                                            <th className={styles.th}>Role</th>
                                            <th className={styles.th}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingJobs.map((job) => (
                                            <tr key={job.id} className={styles.tr}>
                                                <td className={styles.td}>{job.company}</td>
                                                <td className={styles.td}>{job.role}</td>
                                                <td className={styles.td}>
                                                    <button className={`${styles.actionBtn} ${styles.btnApprove}`}>✓</button>
                                                    <button className={`${styles.actionBtn} ${styles.btnReject}`}>✗</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pending Events */}
                        <div>
                            <h3 className={styles.sectionTitle}>Pending Event Posts</h3>
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr className={styles.tr}>
                                            <th className={styles.th}>Event</th>
                                            <th className={styles.th}>Date</th>
                                            <th className={styles.th}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingEvents.map((event) => (
                                            <tr key={event.id} className={styles.tr}>
                                                <td className={styles.td}>{event.name}</td>
                                                <td className={styles.td}>{event.date}</td>
                                                <td className={styles.td}>
                                                    <button className={`${styles.actionBtn} ${styles.btnApprove}`}>✓</button>
                                                    <button className={`${styles.actionBtn} ${styles.btnReject}`}>✗</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
