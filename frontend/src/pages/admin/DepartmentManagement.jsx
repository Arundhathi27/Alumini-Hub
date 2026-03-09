import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, XCircle, Search, Building2, Loader2, Trash2, Hash } from 'lucide-react';
import { adminService } from '../../services/adminService';
import styles from './AdminDashboard.module.css';

const bgColors = ['#eff6ff', '#f0fdf4', '#faf5ff', '#fffbeb', '#fff1f2'];
const iconColors = ['#2563eb', '#16a34a', '#7c3aed', '#d97706', '#e11d48'];

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newDeptName, setNewDeptName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { fetchDepartments(); }, []);

    const fetchDepartments = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getDepartments();
            setDepartments(data);
        } catch { } finally { setIsLoading(false); }
    };

    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await adminService.createDepartment(newDeptName);
            setShowCreateModal(false);
            setNewDeptName('');
            fetchDepartments();
        } catch (err) {
            setError(err.message);
        } finally { setIsSubmitting(false); }
    };

    const filtered = departments.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 36, height: 36, background: '#eff6ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Building2 size={18} color="#2563eb" />
                        </div>
                        Department Management
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.3rem' }}>Manage university departments</p>
                </div>
                <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowCreateModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', color: '#fff', border: 'none', borderRadius: '0.625rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.35)' }}>
                    <Plus size={16} /> Add Department
                </motion.button>
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '0.625rem', padding: '0.5rem 1rem', marginBottom: '1.25rem', maxWidth: 360 }}>
                <Search size={16} style={{ color: '#9ca3af', flexShrink: 0 }} />
                <input type="text" placeholder="Search departments..."
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', color: '#374151', background: 'transparent' }} />
            </motion.div>

            {/* Grid of Department Cards */}
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%' }} />
                </div>
            ) : filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                    <Building2 size={48} color="#e5e7eb" style={{ marginBottom: '1rem' }} />
                    <p style={{ fontWeight: 600, color: '#374151' }}>No departments found</p>
                    <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>Click "Add Department" to create one.</p>
                </motion.div>
            ) : (
                <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}
                    initial="hidden" animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}>
                    {filtered.map((dept, i) => (
                        <motion.div key={dept._id}
                            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                            whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                            style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', border: '1px solid #f0f0f5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '0.625rem', background: bgColors[i % bgColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Building2 size={22} color={iconColors[i % iconColors.length]} />
                                </div>
                                <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 500, background: '#f9fafb', padding: '0.2rem 0.5rem', borderRadius: 6, border: '1px solid #e5e7eb' }}>
                                    #{i + 1}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>{dept.name}</h3>
                            <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                                Created {new Date(dept.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowCreateModal(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.88, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.88, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Add New Department</h2>
                                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.2rem' }}>Enter a department name to add it</p>
                                </div>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowCreateModal(false)}
                                    style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                                    <XCircle size={18} />
                                </motion.button>
                            </div>

                            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                            <form onSubmit={handleCreateDepartment}>
                                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Department Name</label>
                                <input type="text" required placeholder="e.g. Computer Science & Engineering"
                                    value={newDeptName} onChange={e => setNewDeptName(e.target.value)}
                                    style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1.5px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.9rem', outline: 'none', color: '#111827', background: '#f9fafb', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        onClick={() => setShowCreateModal(false)}
                                        style={{ flex: 1, padding: '0.65rem', border: '1.5px solid #e5e7eb', borderRadius: '0.5rem', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
                                        Cancel
                                    </motion.button>
                                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        disabled={isSubmitting}
                                        style={{ flex: 1, padding: '0.65rem', border: 'none', borderRadius: '0.5rem', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', opacity: isSubmitting ? 0.7 : 1 }}>
                                        {isSubmitting ? 'Creating...' : 'Create Department'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DepartmentManagement;
