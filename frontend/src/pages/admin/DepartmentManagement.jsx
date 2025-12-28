import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, XCircle, Search, Building2, Loader, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import styles from './UserManagement.module.css'; // Reusing styles

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newDeptName, setNewDeptName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
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
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Department Management</h1>
                    <p className={styles.subtitle}>Manage university departments</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={styles.createButton}
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus size={20} />
                    <span>Add Department</span>
                </motion.button>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Search departments..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                {isLoading ? (
                    <div className={styles.loadingState}>
                        <Loader className={styles.spinner} size={32} />
                        <p>Loading departments...</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Department Name</th>
                                <th>Created At</th>
                                {/* <th>Actions</th> - Add Delete later if needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDepartments.length > 0 ? (
                                filteredDepartments.map((dept) => (
                                    <tr key={dept._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ padding: '0.5rem', background: '#e0e7ff', borderRadius: '0.375rem', color: '#4f46e5' }}>
                                                    <Building2 size={18} />
                                                </div>
                                                <span className={styles.userName}>{dept.name}</span>
                                            </div>
                                        </td>
                                        <td>{new Date(dept.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className={styles.emptyState}>
                                        No departments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className={styles.modalHeader}>
                                <h2>Add New Department</h2>
                                <button onClick={() => setShowCreateModal(false)}><XCircle size={24} /></button>
                            </div>
                            <form onSubmit={handleCreateDepartment} className={styles.modalForm}>
                                {error && <div className={styles.errorBanner}>{error}</div>}

                                <div className={styles.formGroup}>
                                    <label>Department Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Computer Science & Engineering"
                                        value={newDeptName}
                                        onChange={(e) => setNewDeptName(e.target.value)}
                                    />
                                </div>

                                <div className={styles.modalFooter}>
                                    <button type="button" onClick={() => setShowCreateModal(false)} className={styles.cancelBtn}>Cancel</button>
                                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Create Department'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DepartmentManagement;
