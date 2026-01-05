import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MessageSquare, Edit3, Eye, Clock, CheckCircle, Shield } from 'lucide-react'; // Added Shield here too just in case it's missing
import Sidebar from '../../components/alumni/Sidebar';
import Topbar from '../../components/alumni/Topbar';
import styles from './AlumniDashboard.module.css';
import { useAuth } from '../../context/AuthContext';

const ActionCard = ({ icon: Icon, title, description, color, delay, onClick }) => (
    <motion.div
        className={`${styles.card} ${styles.actionCard}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -4 }}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: color, width: 'fit-content', color: 'white', marginBottom: '1rem' }}>
            <Icon size={24} />
        </div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>{description}</p>
    </motion.div>
);

const AlumniDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    // Mock Data
    const myPosts = [
        { id: 1, type: "Job", title: "Senior React Developer", date: "2025-10-15", status: "Approved" },
        { id: 2, type: "Event", title: "Webinar: Tech Trends", date: "2025-11-01", status: "Pending" },
        { id: 3, type: "Job", title: "Junior Designer", date: "2025-10-20", status: "Rejected" },
    ];

    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Topbar title="Alumni Dashboard" />

                <main className={styles.content}>

                    <motion.div
                        className={styles.card}
                        style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className={styles.profileStatus}>
                            <div className={styles.avatar}>
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Welcome back, {user?.name}!</h2>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Alumni Member</p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {user?.isVerified ? (
                                        <span className={`${styles.badge} ${styles.badgeApproved}`}>
                                            <CheckCircle size={12} style={{ marginRight: '4px' }} /> Verified Alumni
                                        </span>
                                    ) : (
                                        <span className={`${styles.badge} ${styles.badgePending}`}>
                                            Pending Verification
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            className={styles.btnPrimary}
                            onClick={() => navigate('/alumni/profile')}
                        >
                            Complete Profile
                        </button>
                    </motion.div>

                    {/* Verification Warning Banner */}
                    {!user?.isVerified && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            style={{
                                background: '#fffbeb',
                                border: '1px solid #fcd34d',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                marginBottom: '2rem',
                                color: '#92400e',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            <Shield size={20} />
                            <div>
                                <strong>Verification Pending:</strong> Your account is currently under review. You cannot post jobs or events until verified.
                            </div>
                        </motion.div>
                    )}

                    {/* Quick Actions */}
                    <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>Quick Actions</h3>
                    <div className={styles.statsGrid}>
                        <ActionCard
                            icon={Briefcase}
                            title="Post a Job"
                            description="Share opportunities with students."
                            color={user?.isVerified ? "#4f46e5" : "#9ca3af"}
                            delay={0.1}
                            onClick={user?.isVerified ? () => navigate('/alumni/post-job') : null}
                        />
                        <ActionCard
                            icon={Calendar}
                            title="Post an Event"
                            description="Host webinars or meetups."
                            color={user?.isVerified ? "#ec4899" : "#9ca3af"}
                            delay={0.2}
                            onClick={user?.isVerified ? () => navigate('/alumni/post-event') : null}
                        />
                        <ActionCard
                            icon={Edit3}
                            title="Edit Profile"
                            description="Update your professional details."
                            color="#f59e0b"
                            delay={0.3}
                            onClick={() => navigate('/alumni/profile')}
                        />
                        <ActionCard
                            icon={MessageSquare}
                            title="Messages"
                            description="Check inbox for new queries."
                            color="#10b981"
                            delay={0.4}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>

                        {/* My Posts Table */}
                        <div>
                            <h3 className={styles.sectionTitle}>My Posts</h3>
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr className={styles.tr}>
                                            <th className={styles.th}>Type</th>
                                            <th className={styles.th}>Title</th>
                                            <th className={styles.th}>Date</th>
                                            <th className={styles.th}>Status</th>
                                            <th className={styles.th}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myPosts.map((post) => (
                                            <tr key={post.id} className={styles.tr}>
                                                <td className={styles.td}>
                                                    <span className={`${styles.badge} ${post.type === 'Job' ? styles.badgeJob : styles.badgeEvent}`}>
                                                        {post.type}
                                                    </span>
                                                </td>
                                                <td className={styles.td} style={{ fontWeight: 500 }}>{post.title}</td>
                                                <td className={styles.td}>{post.date}</td>
                                                <td className={styles.td}>
                                                    <span className={`${styles.badge} ${post.status === 'Approved' ? styles.badgeApproved :
                                                        post.status === 'Pending' ? styles.badgePending : styles.badgeRejected
                                                        }`}>
                                                        {post.status}
                                                    </span>
                                                </td>
                                                <td className={styles.td}>
                                                    <button className={styles.btnOutline}>View</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Contribution Stats */}
                        <div>
                            <h3 className={styles.sectionTitle}>Overview</h3>
                            <div className={styles.card} style={{ padding: '0' }}>
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: '#6b7280' }}>Total Jobs Posted</span>
                                        <span style={{ fontWeight: 600 }}>12</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: '#e0e7ff', borderRadius: '99px' }}>
                                        <div style={{ width: '70%', height: '100%', background: '#4f46e5', borderRadius: '99px' }}></div>
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: '#6b7280' }}>Total Events</span>
                                        <span style={{ fontWeight: 600 }}>5</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: '#fce7f3', borderRadius: '99px' }}>
                                        <div style={{ width: '40%', height: '100%', background: '#ec4899', borderRadius: '99px' }}></div>
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: '#6b7280' }}>Pending Approval</span>
                                        <span style={{ fontWeight: 600, color: '#d97706' }}>1</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
};

export default AlumniDashboard;
