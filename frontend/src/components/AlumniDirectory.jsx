import React, { useState, useEffect } from 'react';
import { Search, Filter, User, Briefcase, MapPin, Calendar, Linkedin, X, Mail } from 'lucide-react';
import { alumniDirectoryService } from '../services/alumniDirectoryService';
import dashboardStyles from '../pages/alumni/AlumniDashboard.module.css';

const AlumniProfileModal = ({ alumni, onClose }) => {
    if (!alumni) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', borderRadius: '0.5rem', width: '90%', maxWidth: '700px', maxHeight: '90vh',
                overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    padding: '1.5rem', borderBottom: '1px solid #e5e7eb',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>{alumni.user?.name}</h3>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {alumni.user?.department} • Batch {alumni.user?.batchYear}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {/* About */}
                        {alumni.about && (
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>About</span>
                                <p style={{ color: '#374151', lineHeight: '1.6' }}>{alumni.about}</p>
                            </div>
                        )}

                        {/* Current Position */}
                        {alumni.workExperience?.currentCompany && (
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Position</span>
                                <div style={{ color: '#374151' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{alumni.workExperience.designation}</div>
                                    <div>{alumni.workExperience.currentCompany}</div>
                                    {alumni.workExperience.industry && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{alumni.workExperience.industry}</div>}
                                    {alumni.workExperience.yearsOfExperience > 0 && (
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                            {alumni.workExperience.yearsOfExperience} years of experience
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        {alumni.location && (
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Location</span>
                                <div style={{ color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={16} /> {alumni.location}
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {alumni.skills && alumni.skills.length > 0 && (
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Skills</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {alumni.skills.map((skill, index) => (
                                        <span key={index} style={{
                                            background: '#e0e7ff',
                                            color: '#4338ca',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500
                                        }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Links */}
                        {(alumni.socialLinks?.linkedin || alumni.socialLinks?.github || alumni.socialLinks?.portfolio) && (
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Connect</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {alumni.socialLinks.linkedin && (
                                        <a href={alumni.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Linkedin size={16} /> LinkedIn
                                        </a>
                                    )}
                                    {alumni.socialLinks.github && (
                                        <a href={alumni.socialLinks.github} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            GitHub
                                        </a>
                                    )}
                                    {alumni.socialLinks.portfolio && (
                                        <a href={alumni.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Portfolio
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        className={dashboardStyles.btnOutline}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const AlumniDirectory = () => {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        name: '',
        batch: '',
        company: '',
        role: '',
        location: '',
        skills: ''
    });
    const [selectedAlumni, setSelectedAlumni] = useState(null);

    useEffect(() => {
        fetchAlumni();
    }, [filters]);

    const fetchAlumni = async () => {
        setLoading(true);
        try {
            const filterParams = {};
            if (filters.name) filterParams.name = filters.name;
            if (filters.batch) filterParams.batch = filters.batch;
            if (filters.company) filterParams.company = filters.company;
            if (filters.role) filterParams.role = filters.role;
            if (filters.location) filterParams.location = filters.location;
            if (filters.skills) filterParams.skills = filters.skills;

            const data = await alumniDirectoryService.getVerifiedAlumni(filterParams);
            setAlumni(data);
        } catch (error) {
            console.error('Error fetching alumni:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111827' }}>
                Alumni Directory
            </h1>

            {/* Search and Filters */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                        <Search size={16} style={{ display: 'inline-block', marginRight: '0.25rem' }} />
                        Search Name
                    </label>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                        <Calendar size={16} style={{ display: 'inline-block', marginRight: '0.25rem' }} />
                        Batch Year
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. 2020"
                        value={filters.batch}
                        onChange={(e) => handleFilterChange('batch', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                        <Briefcase size={16} style={{ display: 'inline-block', marginRight: '0.25rem' }} />
                        Company
                    </label>
                    <input
                        type="text"
                        placeholder="Search by company..."
                        value={filters.company}
                        onChange={(e) => handleFilterChange('company', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                        <User size={16} style={{ display: 'inline-block', marginRight: '0.25rem' }} />
                        Role
                    </label>
                    <input
                        type="text"
                        placeholder="Search by role..."
                        value={filters.role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                        <MapPin size={16} style={{ display: 'inline-block', marginRight: '0.25rem' }} />
                        Location
                    </label>
                    <input
                        type="text"
                        placeholder="Search by location..."
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                        <Filter size={16} style={{ display: 'inline-block', marginRight: '0.25rem' }} />
                        Skills
                    </label>
                    <input
                        type="text"
                        placeholder="Search by skill..."
                        value={filters.skills}
                        onChange={(e) => handleFilterChange('skills', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
            </div>

            {/* Alumni Cards */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading alumni...</div>
            ) : alumni.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <User size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <div>No alumni found.</div>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {alumni.map((person) => (
                        <div
                            key={person._id}
                            style={{
                                background: 'white',
                                borderRadius: '0.5rem',
                                padding: '1.5rem',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e5e7eb',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            onClick={() => setSelectedAlumni(person)}
                        >
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>
                                    {person.user?.name}
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    {person.user?.department} • Batch {person.user?.batchYear}
                                </p>
                            </div>

                            {person.workExperience?.currentCompany && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                                        {person.workExperience.designation}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Briefcase size={14} /> {person.workExperience.currentCompany}
                                    </div>
                                </div>
                            )}

                            {person.location && (
                                <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <MapPin size={14} /> {person.location}
                                </div>
                            )}

                            {person.skills && person.skills.length > 0 && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {person.skills.slice(0, 3).map((skill, index) => (
                                            <span key={index} style={{
                                                background: '#e0e7ff',
                                                color: '#4338ca',
                                                padding: '0.125rem 0.5rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: 500
                                            }}>
                                                {skill}
                                            </span>
                                        ))}
                                        {person.skills.length > 3 && (
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: '#6b7280',
                                                padding: '0.125rem 0.5rem'
                                            }}>
                                                +{person.skills.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div style={{
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid #e5e7eb'
                            }}>
                                <button
                                    className={dashboardStyles.btnPrimary}
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedAlumni(person);
                                    }}
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AlumniProfileModal
                alumni={selectedAlumni}
                onClose={() => setSelectedAlumni(null)}
            />
        </div>
    );
};

export default AlumniDirectory;
