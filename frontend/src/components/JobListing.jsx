import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Building, Filter } from 'lucide-react';
import { studentJobService } from '../services/studentJobService';
import { motion } from 'framer-motion';

const JobListing = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        title: '',
        location: '',
        type: 'All',
        role: ''
    });

    useEffect(() => {
        fetchJobs();
    }, [filters]); // Debounce could be added here for optimization

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await studentJobService.getApprovedJobs(filters);
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Find Your Next Opportunity</h1>

                {/* Search & Filter Bar */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            name="title"
                            placeholder="Job Title or Keyword"
                            value={filters.title}
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={filters.location}
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                outline: 'none',
                                appearance: 'none',
                                background: 'white'
                            }}
                        >
                            <option value="All">All Job Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Jobs Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Loading jobs...</div>
            ) : jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                    <Briefcase size={48} style={{ marginBottom: '1rem', color: '#d1d5db' }} />
                    <p>No jobs found matching your criteria.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {jobs.map(job => (
                        <motion.div
                            key={job._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            style={{
                                background: 'white',
                                borderRadius: '0.75rem',
                                padding: '1.5rem',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                                border: '1px solid #f3f4f6',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>{job.title}</h3>
                                        <p style={{ color: '#4f46e5', fontWeight: 500, fontSize: '0.9rem', marginTop: '0.25rem' }}>{job.company}</p>
                                    </div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.75rem',
                                        background: '#bfdbfe',
                                        color: '#1e40af',
                                        borderRadius: '9999px',
                                        fontWeight: 500
                                    }}>
                                        {job.type}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    <MapPin size={16} />
                                    <span>{job.location}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    <Building size={16} />
                                    <span>{job.experience} Exp</span>
                                </div>

                                <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {job.description}
                                </p>
                            </div>

                            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Posted by</span>
                                    <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>{job.postedBy?.name || 'Alumni'}</span>
                                </div>
                                <a
                                    href={job.applyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        background: '#4f46e5',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.5rem',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    Apply Now
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobListing;
