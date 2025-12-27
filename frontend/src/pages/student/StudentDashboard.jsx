import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Calendar, MessageCircle, MapPin, Clock, User } from 'lucide-react';
import Sidebar from '../../components/student/Sidebar';
import Topbar from '../../components/student/Topbar';
import styles from './StudentDashboard.module.css';

const QuickCard = ({ icon: Icon, title, description, color, bgColor, delay }) => (
    <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
    >
        <div className={styles.cardIconWrapper} style={{ backgroundColor: bgColor, color: color }}>
            <Icon size={24} />
        </div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{description}</p>
    </motion.div>
);

const StudentDashboard = () => {
    // Mock Data
    const recentJobs = [
        { id: 1, company: "Google", role: "Frontend Developer Intern", location: "Bangalore", type: "Full-time", posted: "2d ago" },
        { id: 2, company: "Microsoft", role: "Software Engineer", location: "Hyderabad", type: "Full-time", posted: "3d ago" },
        { id: 3, company: "Swiggy", role: "Product Designer", location: "Remote", type: "Internship", posted: "5d ago" },
    ];

    const upcomingEvents = [
        { id: 1, title: "Alumni Meetup 2025", date: "Aug 15, 2025", type: "Networking" },
        { id: 2, title: "React Workshop", date: "Sep 01, 2025", type: "Webinar" },
    ];

    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Topbar title="Student Dashboard" />

                <main className={styles.content}>

                    {/* Welcome Banner */}
                    <motion.div
                        className={styles.welcomeBanner}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className={styles.welcomeTitle}>Welcome back, Student! 🎓</h1>
                        <p style={{ opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px' }}>
                            Your gateway to connecting with alumni, finding dream jobs, and participating in exclusive events.
                        </p>
                    </motion.div>

                    {/* Quick Access */}
                    <div className={styles.cardGrid}>
                        <QuickCard
                            icon={Users}
                            title="Alumni Directory"
                            description="Connect with 500+ Alumni"
                            color="#0ea5e9"
                            bgColor="#e0f2fe"
                            delay={0.1}
                        />
                        <QuickCard
                            icon={Briefcase}
                            title="Job Opportunities"
                            description="12 New Openings"
                            color="#f59e0b"
                            bgColor="#fef3c7"
                            delay={0.2}
                        />
                        <QuickCard
                            icon={Calendar}
                            title="Upcoming Events"
                            description="3 Events this week"
                            color="#ec4899"
                            bgColor="#fce7f3"
                            delay={0.3}
                        />
                        <QuickCard
                            icon={MessageCircle}
                            title="Messages"
                            description="2 Unread Messages"
                            color="#10b981"
                            bgColor="#d1fae5"
                            delay={0.4}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem', marginBottom: '3rem' }}>

                        {/* Recent Jobs */}
                        <div>
                            <div className={styles.sectionHeader}>
                                <h3 className={styles.sectionTitle}>
                                    <Briefcase size={20} className="text-sky-600" />
                                    Recent Opportunities
                                </h3>
                                <span className={styles.viewAll}>View All Jobs</span>
                            </div>

                            {recentJobs.map((job) => (
                                <div key={job.id} className={styles.listItem}>
                                    <div className={styles.itemInfo}>
                                        <h4>{job.role}</h4>
                                        <div className={styles.itemMeta}>
                                            <span style={{ color: '#0f172a', fontWeight: 600 }}>{job.company}</span>
                                            <span>•</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <MapPin size={14} /> {job.location}
                                            </span>
                                            <span>•</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={14} /> {job.posted}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span className={styles.tag}>{job.type}</span>
                                        <button className={styles.btnView}>Apply Now</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Upcoming Events */}
                        <div>
                            <div className={styles.sectionHeader}>
                                <h3 className={styles.sectionTitle}>
                                    <Calendar size={20} className="text-pink-500" />
                                    Upcoming Events
                                </h3>
                                <span className={styles.viewAll}>View Calendar</span>
                            </div>

                            {upcomingEvents.map((event) => (
                                <div key={event.id} className={styles.listItem}>
                                    <div className={styles.itemInfo}>
                                        <h4>{event.title}</h4>
                                        <div className={styles.itemMeta}>
                                            <Calendar size={14} /> {event.date}
                                        </div>
                                    </div>
                                    <button className={styles.btnView}>Register</button>
                                </div>
                            ))}

                            {/* Mentorship Promo */}
                            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '1rem', border: '1px solid #bae6fd' }}>
                                <h4 style={{ color: '#0369a1', marginBottom: '0.5rem', fontWeight: 700 }}>Need Career Guidance?</h4>
                                <p style={{ fontSize: '0.9rem', color: '#0c4a6e', marginBottom: '1rem', lineHeight: '1.5' }}>
                                    Our alumni are here to help! Find a mentor in your field today.
                                </p>
                                <button style={{ width: '100%', background: '#0284c7', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s' }}>
                                    Find a Mentor
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Top Alumni Preview */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>
                                <Users size={20} className="text-indigo-600" />
                                Top Featured Alumni
                            </h3>
                            <span className={styles.viewAll}>Browse Directory</span>
                        </div>

                        <div className={styles.alumniGrid}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className={styles.alumniCard}>
                                    <div className={styles.alumniAvatar}>
                                        <User size={32} />
                                    </div>
                                    <h4 className={styles.alumniName}>Alumni Name</h4>
                                    <p className={styles.alumniRole}>Senior Engineer</p>
                                    <p className={styles.alumniCompany}>Google</p>
                                    <button className={styles.btnView} style={{ marginTop: '1rem', width: '100%', fontSize: '0.8rem', padding: '0.4rem' }}>Connect</button>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
