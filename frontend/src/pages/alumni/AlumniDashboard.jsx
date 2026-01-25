import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MessageSquare, Edit3, CheckCircle, Shield } from 'lucide-react';
import Sidebar from '../../components/alumni/Sidebar';
import Topbar from '../../components/alumni/Topbar';
import AlumniMessages from './AlumniMessages';
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

const AlumniOverview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
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
                    onClick={() => navigate('/alumni/messages')}
                />
            </div>
        </>
    );
};

const AlumniDashboard = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Topbar title="Alumni Dashboard" />

                <main className={styles.content}>
                    <Routes>
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AlumniOverview />} />
                        <Route path="messages" element={<AlumniMessages />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AlumniDashboard;
