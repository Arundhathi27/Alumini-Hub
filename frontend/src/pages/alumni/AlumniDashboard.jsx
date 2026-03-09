import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MessageSquare, Edit3, CheckCircle, Shield, TrendingUp, ArrowRight, Star } from 'lucide-react';
import Sidebar from '../../components/alumni/Sidebar';
import Topbar from '../../components/alumni/Topbar';
import AlumniMessages from './AlumniMessages';
import PostJob from './PostJob';
import PostEvent from './PostEvent';
import MyJobs from './MyJobs';
import MyEvents from './MyEvents';
import ProfilePage from './ProfilePage';
import MyPosts from './MyPosts';
import styles from './AlumniDashboard.module.css';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:5001';

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } } };

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActionCard = ({ icon: Icon, title, description, iconColor, iconBg, badge, onClick, disabled }) => (
    <motion.div
        variants={itemVariants}
        whileHover={!disabled ? { y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={!disabled ? onClick : undefined}
        style={{
            background: '#fff', borderRadius: '0.875rem', padding: '1.5rem',
            border: disabled ? '1.5px dashed #e5e7eb' : '1px solid #f0f0f5',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.55 : 1, position: 'relative', overflow: 'hidden',
            transition: 'border-color 0.2s'
        }}
    >
        <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `radial-gradient(circle at 80% 0%,${iconBg},transparent 80%)`, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '0.625rem', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={iconColor} />
            </div>
            {badge && <span style={{ fontSize: '0.7rem', fontWeight: 700, background: iconBg, color: iconColor, padding: '0.2rem 0.55rem', borderRadius: 999 }}>{badge}</span>}
        </div>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>{title}</h3>
        <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.3rem', lineHeight: 1.5 }}>{description}</p>
        {!disabled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.875rem', color: iconColor, fontSize: '0.8rem', fontWeight: 600 }}>
                Get started <ArrowRight size={12} />
            </div>
        )}
    </motion.div>
);

const AlumniOverview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ jobs: 0, events: 0, chatRequests: 0, completion: 0 });
    const initial = user?.name?.charAt(0)?.toUpperCase() || 'A';

    useEffect(() => {
        const fetchAlumniStats = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (!userData || !userData.token) return;

                const config = { headers: { Authorization: `Bearer ${userData.token}` } };

                // Using Promise.all to fetch relevant data
                const [jobsRes, eventsRes, chatRequestsRes, profileRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/alumni/jobs`, config),
                    axios.get(`${API_BASE}/api/alumni/events`, config),
                    axios.get(`${API_BASE}/api/chat/requests?status=Pending`, config),
                    axios.get(`${API_BASE}/api/alumni/profile`, config)
                ]);

                setStats({
                    jobs: jobsRes.data.length || 0,
                    events: eventsRes.data.length || 0,
                    chatRequests: chatRequestsRes.data.length || 0,
                    completion: profileRes.data.completionPercentage || 0
                });
            } catch (error) {
                console.error("Error fetching alumni stats", error);
            }
        };
        fetchAlumniStats();
    }, [user]);

    const statItems = [
        { label: 'Jobs Posted', value: stats.jobs, icon: Briefcase, iconBg: '#eff6ff', iconColor: '#2563eb' },
        { label: 'Events Hosted', value: stats.events, icon: Calendar, iconBg: '#faf5ff', iconColor: '#7c3aed' },
        { label: 'Pending Chats', value: stats.chatRequests, icon: MessageSquare, iconBg: '#f0fdf4', iconColor: '#16a34a' },
        { label: 'Profile Completion', value: `${stats.completion}%`, icon: TrendingUp, iconBg: '#fffbeb', iconColor: '#d97706' },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
            {/* Welcome Card */}
            <motion.div variants={itemVariants}
                style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#2563eb 60%,#3b82f6 100%)', borderRadius: '1rem', padding: '2rem', marginBottom: '1.75rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -30, right: 100, width: 120, height: 120, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', border: '2px solid rgba(255,255,255,0.3)' }}>
                        {initial}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>Welcome back, {user?.name}!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.875rem', marginTop: '0.2rem' }}>Alumni Member</p>
                        <div style={{ marginTop: '0.625rem' }}>
                            {user?.isVerified ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '0.2rem 0.75rem', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, backdropFilter: 'blur(8px)' }}>
                                    <CheckCircle size={12} /> Verified Alumni
                                </span>
                            ) : (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fbbf24', color: '#78350f', padding: '0.2rem 0.75rem', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700 }}>
                                    ⏳ Pending Verification
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/alumni/profile')}
                    style={{ padding: '0.625rem 1.25rem', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.625rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
                    Edit Profile →
                </motion.button>
            </motion.div>

            {/* Verification Warning */}
            {!user?.isVerified && (
                <motion.div variants={itemVariants}
                    style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 32, height: 32, background: '#fde68a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Shield size={15} color="#b45309" />
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                        <strong>Verification Pending:</strong> Your account is under review. Job and event posting will unlock after verification.
                    </p>
                </motion.div>
            )}

            {/* Stat Pills */}
            <motion.div variants={itemVariants}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                {statItems.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
                    <motion.div key={label} whileHover={{ y: -3, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}
                        style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.125rem 1.25rem', border: '1px solid #f0f0f5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: 38, height: 38, borderRadius: '0.5rem', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={18} color={iconColor} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>{value}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>{label}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick Action Cards */}
            <motion.div variants={itemVariants} style={{ marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Quick Actions</h3>
                <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '1.25rem' }} variants={containerVariants}>
                    <ActionCard
                        icon={Briefcase} title="Post a Job" description="Share career opportunities with students and recent graduates."
                        iconColor="#2563eb" iconBg="#eff6ff"
                        onClick={() => navigate('/alumni/post-job')} disabled={!user?.isVerified}
                    />
                    <ActionCard
                        icon={Calendar} title="Post an Event" description="Host webinars, meetups or workshops for the community."
                        iconColor="#7c3aed" iconBg="#faf5ff"
                        onClick={() => navigate('/alumni/post-event')} disabled={!user?.isVerified}
                    />
                    <ActionCard
                        icon={Edit3} title="Edit Profile" description="Update your skills, company, bio and professional details."
                        iconColor="#d97706" iconBg="#fffbeb"
                        onClick={() => navigate('/alumni/profile')}
                    />
                    <ActionCard
                        icon={MessageSquare} title="Messages" description="Check inbox and respond to student or alumni queries."
                        iconColor="#16a34a" iconBg="#f0fdf4" badge={stats.chatRequests > 0 ? `${stats.chatRequests} New` : null}
                        onClick={() => navigate('/alumni/messages')}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
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
                        <Route path="post-job" element={<PostJob />} />
                        <Route path="post-event" element={<PostEvent />} />
                        <Route path="jobs/my-jobs" element={<MyJobs />} />
                        <Route path="events/my-events" element={<MyEvents />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="messages" element={<AlumniMessages />} />
                        <Route path="posts" element={<MyPosts />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AlumniDashboard;
