import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Briefcase, MapPin, Calendar, Linkedin, X, Users,
    GraduationCap, Globe, Github, Star, ExternalLink, BookOpen, ChevronDown
} from 'lucide-react';
import { alumniDirectoryService } from '../services/alumniDirectoryService';
import { useDebounce } from '../hooks/useDebounce';

/* ─── Avatar gradient palette — blues / indigos / purples only ─── */
const GRADIENTS = [
    ['#1e3a8a', '#2563eb'],   // deep blue
    ['#1d4ed8', '#3b82f6'],   // medium blue
    ['#4338ca', '#6366f1'],   // indigo
    ['#5b21b6', '#7c3aed'],   // purple
    ['#2563eb', '#818cf8'],   // blue → indigo
    ['#1e40af', '#60a5fa'],   // royal blue → sky
];
const avatarGrad = (name = '') => {
    const idx = (name.charCodeAt(0) || 0) % GRADIENTS.length;
    return GRADIENTS[idx];
};

/* ─── Stat Pill ─── */
const Pill = ({ icon: Icon, label, color = '#2563eb', bg = '#eff6ff' }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: bg, color, padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600 }}>
        <Icon size={11} /> {label}
    </span>
);

/* ─── Alumni Card ─── */
const AlumniCard = ({ person, onClick, index }) => {
    const name = person.user?.name || 'Alumni';
    const [c1, c2] = avatarGrad(name);
    const initial = name.charAt(0).toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
            onClick={onClick}
            style={{
                background: '#fff', borderRadius: '1rem', border: '1px solid #f0f0f5',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', cursor: 'pointer',
                transition: 'box-shadow 0.25s, border-color 0.25s',
            }}
        >
            {/* Card top strip */}
            <div style={{ height: 6, background: `linear-gradient(90deg,${c1},${c2})` }} />

            <div style={{ padding: '1.5rem' }}>
                {/* Avatar + Name */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                        background: `linear-gradient(135deg,${c1},${c2})`,
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1.125rem',
                        boxShadow: `0 4px 12px ${c1}55`
                    }}>
                        {initial}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '1rem', marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {name}
                        </h3>
                        {person.workExperience?.designation && (
                            <p style={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: 500 }}>{person.workExperience.designation}</p>
                        )}
                        {person.user?.department && (
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.1rem' }}>{person.user.department}</p>
                        )}
                    </div>
                </div>

                {/* Meta Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {person.user?.batchYear && <Pill icon={GraduationCap} label={`Batch ${person.user.batchYear}`} color="#7c3aed" bg="#faf5ff" />}
                    {person.workExperience?.currentCompany && <Pill icon={Briefcase} label={person.workExperience.currentCompany} color="#2563eb" bg="#eff6ff" />}
                    {person.location && <Pill icon={MapPin} label={person.location} color="#16a34a" bg="#f0fdf4" />}
                    {person.workExperience?.yearsOfExperience > 0 && <Pill icon={Star} label={`${person.workExperience.yearsOfExperience}y exp`} color="#d97706" bg="#fffbeb" />}
                </div>

                {/* Skills */}
                {person.skills?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.125rem' }}>
                        {person.skills.slice(0, 4).map((skill, i) => (
                            <span key={i} style={{ background: '#f0f4ff', color: '#4338ca', padding: '0.15rem 0.55rem', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600 }}>
                                {skill}
                            </span>
                        ))}
                        {person.skills.length > 4 && (
                            <span style={{ fontSize: '0.72rem', color: '#9ca3af', padding: '0.15rem 0.4rem', fontWeight: 500 }}>+{person.skills.length - 4}</span>
                        )}
                    </div>
                )}

                {/* View Profile Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={e => { e.stopPropagation(); onClick(); }}
                    style={{
                        width: '100%', padding: '0.55rem',
                        background: `linear-gradient(135deg,${c1},${c2})`,
                        color: '#fff', border: 'none', borderRadius: '0.625rem',
                        fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                        boxShadow: `0 4px 12px ${c1}40`,
                    }}
                >
                    View Profile
                </motion.button>
            </div>
        </motion.div>
    );
};

/* ─── Profile Modal ─── */
const ProfileModal = ({ alumni, onClose }) => {
    if (!alumni) return null;
    const name = alumni.user?.name || 'Alumni';
    const [c1, c2] = avatarGrad(name);
    const initial = name.charAt(0).toUpperCase();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.55)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            >
                <motion.div
                    initial={{ scale: 0.88, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.88, opacity: 0, y: 24 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    onClick={e => e.stopPropagation()}
                    style={{ background: '#fff', borderRadius: '1.25rem', width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
                >
                    {/* Modal Hero */}
                    <div style={{ background: `linear-gradient(135deg,${c1},${c2})`, padding: '2rem', position: 'relative', overflow: 'hidden', borderRadius: '1.25rem 1.25rem 0 0' }}>
                        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', bottom: -20, left: 60, width: 100, height: 100, background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />

                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.625rem', border: '3px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
                                    {initial}
                                </div>
                                <div>
                                    <h2 style={{ color: '#fff', fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.4px' }}>{name}</h2>
                                    {alumni.workExperience?.designation && (
                                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                                            {alumni.workExperience.designation}
                                            {alumni.workExperience.currentCompany && ` @ ${alumni.workExperience.currentCompany}`}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                                        {alumni.user?.batchYear && (
                                            <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '0.2rem 0.65rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(8px)' }}>
                                                Batch {alumni.user.batchYear}
                                            </span>
                                        )}
                                        {alumni.user?.department && (
                                            <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '0.2rem 0.65rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(8px)' }}>
                                                {alumni.user.department}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <motion.button whileHover={{ scale: 1.1, rotate: 5 }} onClick={onClose}
                                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', flexShrink: 0 }}>
                                <X size={16} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div style={{ padding: '1.75rem', display: 'grid', gap: '1.5rem' }}>

                        {/* About */}
                        {alumni.about && (
                            <div style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #f0f0f5' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                                    <BookOpen size={14} color="#2563eb" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>About</span>
                                </div>
                                <p style={{ color: '#374151', lineHeight: '1.65', fontSize: '0.875rem' }}>{alumni.about}</p>
                            </div>
                        )}

                        {/* Work Info */}
                        {alumni.workExperience?.currentCompany && (
                            <div style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #f0f0f5' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                                    <Briefcase size={14} color="#7c3aed" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Position</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                    {[
                                        { label: 'Company', value: alumni.workExperience.currentCompany },
                                        { label: 'Designation', value: alumni.workExperience.designation },
                                        { label: 'Industry', value: alumni.workExperience.industry },
                                        { label: 'Experience', value: alumni.workExperience.yearsOfExperience > 0 ? `${alumni.workExperience.yearsOfExperience} years` : null },
                                    ].filter(i => i.value).map(({ label, value }) => (
                                        <div key={label}>
                                            <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, marginBottom: '0.15rem' }}>{label}</div>
                                            <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        {alumni.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', background: '#f0fdf4', borderRadius: '0.625rem', padding: '0.875rem 1.125rem', border: '1px solid #bbf7d0' }}>
                                <MapPin size={16} color="#16a34a" />
                                <span style={{ fontSize: '0.875rem', color: '#15803d', fontWeight: 600 }}>{alumni.location}</span>
                            </div>
                        )}

                        {/* Skills */}
                        {alumni.skills?.length > 0 && (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <Star size={14} color="#d97706" fill="#d97706" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skills</span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {alumni.skills.map((skill, i) => (
                                        <motion.span key={i} whileHover={{ scale: 1.06 }}
                                            style={{ background: `linear-gradient(135deg,${c1}22,${c2}33)`, color: c1, padding: '0.3rem 0.75rem', borderRadius: 8, fontSize: '0.8125rem', fontWeight: 600, border: `1px solid ${c1}33` }}>
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Links */}
                        {(alumni.socialLinks?.linkedin || alumni.socialLinks?.github || alumni.socialLinks?.portfolio) && (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <Globe size={14} color="#2563eb" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Connect</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    {alumni.socialLinks.linkedin && (
                                        <motion.a href={alumni.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04 }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#EBF5FB', color: '#0077B5', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem', border: '1px solid #bfdbfe' }}>
                                            <Linkedin size={15} /> LinkedIn
                                        </motion.a>
                                    )}
                                    {alumni.socialLinks.github && (
                                        <motion.a href={alumni.socialLinks.github} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04 }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f3f4f6', color: '#111827', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem', border: '1px solid #e5e7eb' }}>
                                            <Github size={15} /> GitHub
                                        </motion.a>
                                    )}
                                    {alumni.socialLinks.portfolio && (
                                        <motion.a href={alumni.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04 }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem', border: '1px solid #bbf7d0' }}>
                                            <Globe size={15} /> Portfolio
                                        </motion.a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' }}>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClose}
                            style={{ padding: '0.55rem 1.5rem', border: '1.5px solid #e5e7eb', borderRadius: '0.625rem', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
                            Close
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ─── Search Field ─── */
const SearchField = ({ icon: Icon, placeholder, value, onChange, color = '#2563eb', bg = '#eff6ff' }) => (
    <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color, pointerEvents: 'none' }}>
            <Icon size={14} />
        </div>
        <input
            type="text" placeholder={placeholder} value={value} onChange={onChange}
            style={{
                width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                border: '1.5px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.8125rem',
                color: '#374151', background: '#f9fafb', outline: 'none',
                fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.18s, box-shadow 0.18s',
            }}
            onFocus={e => { e.target.style.borderColor = color; e.target.style.boxShadow = `0 0 0 3px ${bg}`; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f9fafb'; }}
        />
    </div>
);

/* ─── Main Component ─── */
const AlumniDirectory = () => {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ name: '', batch: '', company: '', role: '', location: '', skills: '' });
    const [selectedAlumni, setSelectedAlumni] = useState(null);

    const debouncedName = useDebounce(filters.name, 500);
    const debouncedBatch = useDebounce(filters.batch, 500);
    const debouncedCompany = useDebounce(filters.company, 500);
    const debouncedRole = useDebounce(filters.role, 500);
    const debouncedLocation = useDebounce(filters.location, 500);
    const debouncedSkills = useDebounce(filters.skills, 500);

    useEffect(() => { fetchAlumni(); }, [debouncedName, debouncedBatch, debouncedCompany, debouncedRole, debouncedLocation, debouncedSkills]);

    const fetchAlumni = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.name) params.name = filters.name;
            if (filters.batch) params.batch = filters.batch;
            if (filters.company) params.company = filters.company;
            if (filters.role) params.role = filters.role;
            if (filters.location) params.location = filters.location;
            if (filters.skills) params.skills = filters.skills;
            const data = await alumniDirectoryService.getVerifiedAlumni(params);
            setAlumni(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const set = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));
    const clear = () => setFilters({ name: '', batch: '', company: '', role: '', location: '', skills: '' });
    const activeCount = Object.values(filters).filter(Boolean).length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
            {/* ── Page Header ── */}
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 36, height: 36, background: '#eff6ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={18} color="#2563eb" />
                        </div>
                        Alumni Directory
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.3rem' }}>
                        {loading ? 'Loading...' : `${alumni.length} verified alumni found`}
                    </p>
                </div>
                {activeCount > 0 && (
                    <motion.button whileHover={{ scale: 1.03 }} onClick={clear}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.875rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>
                        <X size={13} /> Clear {activeCount} filter{activeCount > 1 ? 's' : ''}
                    </motion.button>
                )}
            </motion.div>

            {/* ── Primary Search Bar ── */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '0.875rem', padding: '0.75rem 1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <Search size={18} style={{ color: '#9ca3af', flexShrink: 0 }} />
                <input type="text" placeholder="Search by name, company, role or skill..."
                    value={filters.name || filters.company || filters.role}
                    onChange={e => set('name', e.target.value)}
                    style={{ border: 'none', outline: 'none', fontSize: '0.9375rem', color: '#374151', width: '100%', fontFamily: 'Inter, sans-serif', background: 'transparent' }} />
                <motion.button whileHover={{ scale: 1.03 }} onClick={() => setShowFilters(v => !v)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.875rem', background: showFilters ? '#eff6ff' : '#f3f4f6', color: showFilters ? '#2563eb' : '#6b7280', border: `1.5px solid ${showFilters ? '#bfdbfe' : '#e5e7eb'}`, borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', flexShrink: 0 }}>
                    <ChevronDown size={14} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    Filters {activeCount > 0 && `(${activeCount})`}
                </motion.button>
            </motion.div>

            {/* ── Advanced Filters (collapsible) ── */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        key="filters"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden', marginBottom: '1.25rem' }}
                    >
                        <div style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '0.875rem', padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '0.875rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <SearchField icon={Calendar} placeholder="Batch year (e.g. 2020)" value={filters.batch} onChange={e => set('batch', e.target.value)} color="#7c3aed" bg="#faf5ff22" />
                            <SearchField icon={Briefcase} placeholder="Search by company..." value={filters.company} onChange={e => set('company', e.target.value)} color="#2563eb" bg="#eff6ff55" />
                            <SearchField icon={GraduationCap} placeholder="Search by role..." value={filters.role} onChange={e => set('role', e.target.value)} color="#16a34a" bg="#f0fdf455" />
                            <SearchField icon={MapPin} placeholder="Search by location..." value={filters.location} onChange={e => set('location', e.target.value)} color="#d97706" bg="#fffbeb55" />
                            <SearchField icon={Star} placeholder="Search by skill..." value={filters.skills} onChange={e => set('skills', e.target.value)} color="#dc2626" bg="#fff1f255" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Filter Chips */}
            {activeCount > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {Object.entries(filters).filter(([, v]) => v).map(([key, val]) => (
                        <motion.span key={key} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.625rem 0.25rem 0.75rem', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600, border: '1px solid #bfdbfe' }}>
                            {key}: {val}
                            <button onClick={() => set(key, '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', padding: 0 }}>
                                <X size={11} />
                            </button>
                        </motion.span>
                    ))}
                </motion.div>
            )}

            {/* ── Alumni Grid ── */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #f0f0f5', height: 220 }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(90deg,#f0f0f5 25%,#e8e8ef 50%,#f0f0f5 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ height: 16, background: '#f0f0f5', borderRadius: 6, marginBottom: 8, width: '70%' }} />
                                    <div style={{ height: 12, background: '#f0f0f5', borderRadius: 6, width: '50%' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
                                {[60, 80, 50].map((w, j) => <div key={j} style={{ height: 22, background: '#f0f0f5', borderRadius: 999, width: w }} />)}
                            </div>
                            <div style={{ height: 36, background: '#f0f0f5', borderRadius: 10 }} />
                        </div>
                    ))}
                </div>
            ) : alumni.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '1rem', border: '1px solid #f0f0f5' }}>
                    <Users size={56} color="#e5e7eb" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>No alumni found</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Try adjusting your search filters</p>
                    {activeCount > 0 && (
                        <motion.button whileHover={{ scale: 1.03 }} onClick={clear}
                            style={{ marginTop: '1.25rem', padding: '0.55rem 1.25rem', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', color: '#fff', border: 'none', borderRadius: '0.625rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                            Clear all filters
                        </motion.button>
                    )}
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
                    {alumni.map((person, i) => (
                        <AlumniCard key={person._id} person={person} index={i} onClick={() => setSelectedAlumni(person)} />
                    ))}
                </div>
            )}

            <ProfileModal alumni={selectedAlumni} onClose={() => setSelectedAlumni(null)} />
        </motion.div>
    );
};

export default AlumniDirectory;
