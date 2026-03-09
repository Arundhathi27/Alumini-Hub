import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, Calendar, MessageCircle, MapPin, Clock, ArrowRight, Star, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './StudentDashboard.module.css';
import axios from 'axios';

const API_BASE = 'http://localhost:5001';

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

/* Quick Access Card */
const QuickCard = ({ icon: Icon, title, desc, color, bg, badge, onClick }) => (
    <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
        onClick={onClick}
        style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', border: '1px solid #f0f0f5', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: `radial-gradient(circle at 80% 0%,${bg},transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '0.625rem', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={color} />
            </div>
            {badge && <span style={{ background: bg, color, padding: '0.2rem 0.55rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>{badge}</span>}
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{title}</h3>
        <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.2rem' }}>{desc}</p>
    </motion.div>
);

const StudentOverview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [recentJobs, setRecentJobs] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [alumniProfiles, setAlumniProfiles] = useState([]);
    const [counts, setCounts] = useState({ alumni: 0, jobs: 0, events: 0 });
    const [loading, setLoading] = useState(true);

    const colors = ['#4285F4', '#00A4EF', '#FF6D00', '#7c3aed', '#2563eb', '#16a34a', '#d97706', '#dc2626'];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (!userData || !userData.token) return;
                const config = { headers: { Authorization: `Bearer ${userData.token}` } };

                // Using Promise.all to fetch all required data concurrently
                const [jobsRes, eventsRes, alumniRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/jobs`, config), // Approved jobs (verificationRoutes)
                    axios.get(`${API_BASE}/api/events`, config), // Assuming this gets approved events
                    axios.get(`${API_BASE}/api/alumni`, config) // Verified alumni
                ]);

                const jobs = jobsRes.data || [];
                const events = eventsRes.data || [];
                const alumni = alumniRes.data || [];

                // Assign random colors for UI flair
                const coloredJobs = jobs.map((job, i) => ({ ...job, color: colors[i % colors.length] }));
                const coloredEvents = events.map((event, i) => ({ ...event, color: colors[(i + 2) % colors.length] }));
                const coloredAlumni = alumni.map((alum, i) => ({ ...alum, color: colors[(i + 4) % colors.length] }));

                setRecentJobs(coloredJobs.slice(0, 3));
                setUpcomingEvents(coloredEvents.slice(0, 3));
                setAlumniProfiles(coloredAlumni.slice(0, 4));

                setCounts({
                    alumni: alumni.length,
                    jobs: jobs.length,
                    events: events.length
                });

            } catch (error) {
                console.error("Error fetching student dashboard data", error);
                if (error.response) console.error("Data:", error.response.data);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 size={40} color="#2563eb" />
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
            {/* Welcome Banner */}
            <motion.div variants={itemVariants}
                style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#2563eb 60%,#3b82f6 100%)', borderRadius: '1rem', padding: '2rem', marginBottom: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -20, right: 80, width: 100, height: 100, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                    Welcome back, {user?.name || 'Student'}! 🎓
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.9375rem', margin: '0.5rem 0 1.5rem', maxWidth: 520 }}>
                    Your gateway to connecting with alumni, finding dream jobs, and participating in exclusive events.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {[{ label: `${counts.alumni} Alumni`, icon: Users }, { label: `${counts.jobs} Jobs`, icon: Briefcase }, { label: `${counts.events} Events`, icon: Calendar }].map(({ label, icon: Icon }) => (
                        <motion.div key={label} whileHover={{ y: -2 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: '0.5rem', padding: '0.4rem 0.875rem', color: '#fff', fontSize: '0.8125rem', fontWeight: 600 }}>
                            <Icon size={13} /> {label}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Quick Access Cards */}
            <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }} variants={containerVariants}>
                <QuickCard icon={Users} title="Alumni Directory" desc={`Connect with ${counts.alumni} Alumni`} color="#2563eb" bg="#eff6ff" badge={`${counts.alumni}+`} onClick={() => navigate('/student/alumni')} />
                <QuickCard icon={Briefcase} title="Job Opportunities" desc="Browse latest openings" color="#d97706" bg="#fffbeb" badge={`${counts.jobs}+`} onClick={() => navigate('/student/jobs')} />
                <QuickCard icon={Calendar} title="Upcoming Events" desc={`${counts.events} Events available`} color="#7c3aed" bg="#faf5ff" badge={`${counts.events} Now`} onClick={() => navigate('/student/events')} />
                <QuickCard icon={MessageCircle} title="Messages" desc="Check network responses" color="#16a34a" bg="#f0fdf4" badge="Chat" onClick={() => navigate('/student/messages')} />
            </motion.div>

            {/* Jobs + Events Row */}
            <motion.div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.5rem', marginBottom: '2rem' }} variants={itemVariants}>
                {/* Recent Jobs */}
                <div style={{ background: '#fff', borderRadius: '0.875rem', border: '1px solid #f0f0f5', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.125rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <Briefcase size={16} color="#2563eb" /> Recent Opportunities
                        </h3>
                        <motion.button whileHover={{ x: 3 }} onClick={() => navigate('/student/jobs')}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                            View All <ArrowRight size={13} />
                        </motion.button>
                    </div>
                    <div style={{ flex: 1 }}>
                        <AnimatePresence>
                            {recentJobs.length > 0 ? recentJobs.map((job, i) => (
                                <motion.div key={job._id || job.id}
                                    initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                                    whileHover={{ backgroundColor: '#f8faff' }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.5rem', borderBottom: i < recentJobs.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: `${job.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: job.color }}>
                                            {job.company?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{job.role}</div>
                                            <div style={{ fontSize: '0.78rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                                                <span style={{ fontWeight: 600, color: '#374151' }}>{job.company}</span>
                                                <span>•</span><MapPin size={11} />{job.location}
                                                <span>•</span><Clock size={11} />{new Date(job.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600 }}>{job.jobType || job.type}</span>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                                            onClick={() => navigate('/student/jobs')}
                                            style={{ padding: '0.35rem 0.875rem', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                                            Apply
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                                    No recent job opportunities available.
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Upcoming Events + Mentor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ background: '#fff', borderRadius: '0.875rem', border: '1px solid #f0f0f5', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.125rem 1.25rem', borderBottom: '1px solid #f3f4f6' }}>
                            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                <Calendar size={16} color="#7c3aed" /> Upcoming Events
                            </h3>
                        </div>
                        <div style={{ flex: 1 }}>
                            <AnimatePresence>
                                {upcomingEvents.length > 0 ? upcomingEvents.map((ev, i) => (
                                    <motion.div key={ev._id || ev.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                                        whileHover={{ backgroundColor: '#f8faff' }}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderBottom: i < upcomingEvents.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: `${ev.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Calendar size={14} color={ev.color} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{ev.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(ev.date).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/student/events')}
                                            style={{ padding: '0.25rem 0.6rem', background: `${ev.color}15`, color: ev.color, border: 'none', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>RSVP</motion.button>
                                    </motion.div>
                                )) : (
                                    <div style={{ padding: '1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.8125rem' }}>
                                        No upcoming events.
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mentor CTA */}
                    <motion.div whileHover={{ scale: 1.01 }}
                        style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', borderRadius: '0.875rem', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                        <h4 style={{ color: '#fff', fontWeight: 700, margin: '0 0 0.4rem 0', fontSize: '0.9375rem' }}>Need Career Guidance?</h4>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8125rem', margin: '0 0 1rem 0', lineHeight: 1.5 }}>Our alumni are here to help! Find a mentor in your field today.</p>
                        <motion.button onClick={() => navigate('/student/alumni')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem' }}>
                            Find a Mentor →
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Featured Alumni */}
            <motion.div variants={itemVariants}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <Star size={16} color="#d97706" fill="#d97706" /> Featured Alumni
                    </h3>
                    <motion.button whileHover={{ x: 3 }} onClick={() => navigate('/student/alumni')}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                        Browse All <ArrowRight size={13} />
                    </motion.button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    <AnimatePresence>
                        {alumniProfiles.length > 0 ? alumniProfiles.map((alum, i) => (
                            <motion.div key={alum._id || i}
                                variants={itemVariants}
                                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                                style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', border: '1px solid #f0f0f5', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg,${alum.color},${alum.color}88)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', margin: '0 auto 0.875rem' }}>
                                    {(alum.name || alum.user?.name || 'A').charAt(0).toUpperCase()}
                                </div>
                                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem', margin: '0 0 0.2rem 0' }}>{alum.name || alum.user?.name || 'Alumni'}</div>
                                <div style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0 0 0.15rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alum.workExperience?.designation || alum.department || alum.user?.department || 'Alumni'}</div>
                                <div style={{ fontSize: '0.78rem', color: alum.color, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alum.workExperience?.currentCompany || alum.batchYear || alum.user?.batchYear || 'Verified Alumni'}</div>
                                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                    onClick={() => navigate('/student/alumni')}
                                    style={{ marginTop: '1rem', width: '100%', padding: '0.45rem', background: `${alum.color}15`, color: alum.color, border: `1px solid ${alum.color}30`, borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                                    Connect
                                </motion.button>
                            </motion.div>
                        )) : (
                            <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#6b7280', background: '#fff', borderRadius: '0.875rem', border: '1px solid #f0f0f5' }}>
                                No alumni profiles available yet.
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StudentOverview;
