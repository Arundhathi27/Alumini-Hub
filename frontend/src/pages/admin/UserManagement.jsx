import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, Search, Filter, MoreVertical,
    CheckCircle, XCircle, Shield, GraduationCap, Briefcase,
    Loader, Trash2, Edit2, AlertCircle, ArrowLeft, Folder,
    ToggleLeft, ToggleRight, Upload, FileSpreadsheet, Download
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import styles from './UserManagement.module.css';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('Alumni'); // Alumni, Staff, Student
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'batches', 'departments'
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'user@123',
        role: 'Alumni',
        batchYear: '',
        department: ''
    });
    const [editingUserId, setEditingUserId] = useState(null);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const [uploadReport, setUploadReport] = useState(null); // { added, failed, errors }

    useEffect(() => {
        // Reset view mode when tab changes
        if (activeTab === 'Alumni' || activeTab === 'Student') {
            setViewMode('departments');
            setSelectedBatch(null);
            setSelectedDepartment(null);
        } else {
            setViewMode('list');
        }
        fetchUsers();
        if (adminService.getDepartments) fetchDepartments();
    }, [activeTab]);

    const fetchDepartments = async () => {
        try {
            const data = await adminService.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getUsers(activeTab);
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOrUpdateUser = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsSubmitting(true);

        try {
            const data = { ...formData, role: activeTab };
            if (editingUserId) {
                await adminService.updateUser(editingUserId, data);
            } else {
                await adminService.createUser(data);
            }
            setShowCreateModal(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            setFormError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', password: 'user@123', role: activeTab, batchYear: '', department: '' });
        setEditingUserId(null);
    };

    const handleEditClick = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Keep empty to not update unless changed
            role: user.role,
            batchYear: user.batchYear || '',
            department: user.department || ''
        });
        setEditingUserId(user._id);
        setShowCreateModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await adminService.deleteUser(id);
            fetchUsers();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleVerify = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status ? 'verify' : 'unverify'} this user?`)) return;
        try {
            await adminService.verifyAlumni(id, status);
            fetchUsers();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleActivate = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status ? 'activate' : 'deactivate'} this user?`)) return;
        try {
            await adminService.activateUser(id, status);
            fetchUsers();
        } catch (error) {
            alert(error.message);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (viewMode === 'list' && (activeTab === 'Alumni' || activeTab === 'Student')) {
            return matchesSearch && user.batchYear === selectedBatch && user.department === selectedDepartment;
        }
        return matchesSearch;
    });



    const handleDownloadSample = () => {
        const headers = [['Name', 'Email', 'Batch', 'Department']];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(headers);

        // Add some instruction or sample data?
        // Sample data
        XLSX.utils.sheet_add_json(ws, [
            { Name: 'John Doe', Email: 'john@example.com', Batch: '2023', Department: 'MCA' },
            { Name: 'Jane Smith', Email: 'jane@example.com', Batch: '2024', Department: 'MBA' }
        ], { origin: 'A2', skipHeader: true });

        XLSX.utils.book_append_sheet(wb, ws, "Users");
        XLSX.writeFile(wb, `${activeTab}_Upload_Sample.xlsx`);
    };

    const handleBulkUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('role', activeTab);

        if (!window.confirm(`Upload ${file.name} to add ${activeTab}s?`)) {
            e.target.value = null; // Reset
            return;
        }

        try {
            setIsLoading(true);
            const res = await adminService.bulkUploadUsers(formData);
            setUploadReport(res.report);
            await fetchUsers();
            alert(`Bulk Upload Complete!\nAdded: ${res.report.added}\nFailed: ${res.report.failed}`);
        } catch (error) {
            console.error(error);
            alert('Upload failed: ' + error.message);
        } finally {
            setIsLoading(false);
            e.target.value = null; // Reset input
        }
    };

    const getUniqueDepartments = () => {
        const depts = users
            .map(user => user.department)
            .filter(dept => dept) // Remove empty
            .reduce((acc, dept) => {
                acc[dept] = (acc[dept] || 0) + 1;
                return acc;
            }, {});
        return Object.entries(depts).map(([name, count]) => ({ name, count }));
    };

    const getUniqueBatches = () => {
        const batches = users
            .filter(user => user.department === selectedDepartment) // Filter by selected dept
            .map(user => user.batchYear)
            .filter(year => year)
            .reduce((acc, year) => {
                acc[year] = (acc[year] || 0) + 1;
                return acc;
            }, {});

        return Object.entries(batches).map(([year, count]) => ({ year, count }));
    };



    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>User Management</h1>
                    <p className={styles.subtitle}>Manage alumni, staff, and student accounts</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                    />
                    <button
                        className={styles.createButton}
                        style={{ background: '#10b981' }}
                        onClick={handleDownloadSample}
                        title="Download Excel Template"
                    >
                        <Download size={20} />
                        <span>Sample</span>
                    </button>
                    <button
                        className={styles.createButton}
                        style={{ background: '#f59e0b' }}
                        onClick={handleBulkUploadClick}
                    >
                        <FileSpreadsheet size={20} />
                        <span>Bulk Upload</span>
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={styles.createButton}
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={20} />
                        <span>Add {activeTab}</span>
                    </motion.button>
                </div>
            </div>

            <div className={styles.tabs}>
                {['Alumni', 'Staff', 'Student'].map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'Alumni' && <GraduationCap size={18} />}
                        {tab === 'Staff' && <Briefcase size={18} />}
                        {tab === 'Student' && <Users size={18} />}
                        <span>{tab}s</span>
                    </button>
                ))}
            </div>

            <div className={styles.controls}>
                {viewMode === 'batches' && selectedDepartment && (
                    <button className={styles.backButton} onClick={() => {
                        setViewMode('departments');
                        setSelectedDepartment(null);
                    }}>
                        <ArrowLeft size={18} />
                        Back to Departments
                    </button>
                )}
                {viewMode === 'list' && selectedBatch && (
                    <button className={styles.backButton} onClick={() => {
                        setViewMode('batches');
                        setSelectedBatch(null);
                        setSearchTerm('');
                    }}>
                        <ArrowLeft size={18} />
                        Back to Batches
                    </button>
                )}

                {viewMode === 'list' && (
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}s...`}
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {viewMode === 'departments' && !isLoading ? (
                <div className={styles.batchGrid}>
                    {getUniqueDepartments().length > 0 ? (
                        getUniqueDepartments().map(({ name, count }) => (
                            <motion.div
                                key={name}
                                className={styles.batchCard}
                                onClick={() => {
                                    setSelectedDepartment(name);
                                    setViewMode('batches');
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={styles.batchIcon}>
                                    <Briefcase size={32} />
                                </div>
                                <div className={styles.batchYear}>{name}</div>
                                <div className={styles.batchCount}>{count} Users</div>
                            </motion.div>
                        ))
                    ) : (
                        <div className={styles.emptyState} style={{ gridColumn: '1/-1' }}>
                            No departments found with users.
                        </div>
                    )}
                </div>
            ) : viewMode === 'batches' && !isLoading ? (
                <div className={styles.batchGrid}>
                    {getUniqueBatches().length > 0 ? (
                        getUniqueBatches().map(({ year, count }) => (
                            <motion.div
                                key={year}
                                className={styles.batchCard}
                                onClick={() => {
                                    setSelectedBatch(year);
                                    setViewMode('list');
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={styles.batchIcon}>
                                    <Folder size={32} />
                                </div>
                                <div className={styles.batchYear}>Batch {year}</div>
                                <div className={styles.batchCount}>{count} Users</div>
                            </motion.div>
                        ))
                    ) : (
                        <div className={styles.emptyState} style={{ gridColumn: '1/-1' }}>
                            No batches found for {selectedDepartment}.
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    {isLoading ? (
                        <div className={styles.loadingState}>
                            <Loader className={styles.spinner} size={32} />
                            <p>Loading users...</p>
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    {(activeTab === 'Alumni' || activeTab === 'Student') && <th>Batch / Dept</th>}
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className={styles.userName}>{user.name}</div>
                                            </td>
                                            <td>{user.email}</td>
                                            {(activeTab === 'Alumni' || activeTab === 'Student') && (
                                                <td>{user.batchYear || '-'} / {user.department || '-'}</td>
                                            )}
                                            <td>
                                                <div className={styles.badges}>
                                                    {activeTab === 'Alumni' && (
                                                        <span className={`${styles.badge} ${user.isVerified ? styles.verified : styles.pending}`}>
                                                            {user.isVerified ? 'Verified' : 'Pending'}
                                                        </span>
                                                    )}
                                                    <span className={`${styles.badge} ${user.isActive ? styles.active : styles.inactive}`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.actions}>
                                                    {activeTab === 'Alumni' && !user.isVerified && (
                                                        <button
                                                            className={styles.actionBtn}
                                                            title="Approve Alumni"
                                                            onClick={() => handleVerify(user._id, true)}
                                                        >
                                                            <CheckCircle size={18} className={styles.successIcon} />
                                                        </button>
                                                    )}

                                                    <button
                                                        className={styles.actionBtn}
                                                        title={user.isActive ? "Deactivate" : "Activate"}
                                                        onClick={() => handleActivate(user._id, !user.isActive)}
                                                    >
                                                        {user.isActive ? (
                                                            <ToggleRight size={24} className={styles.successIcon} />
                                                        ) : (
                                                            <ToggleLeft size={24} className={styles.inactiveIcon} />
                                                        )}
                                                    </button>

                                                    <button
                                                        className={styles.actionBtn}
                                                        title="Edit User"
                                                        onClick={() => handleEditClick(user)}
                                                    >
                                                        <Edit2 size={18} className={styles.editIcon} />
                                                    </button>

                                                    <button
                                                        className={styles.actionBtn}
                                                        title="Delete User"
                                                        onClick={() => handleDelete(user._id)}
                                                    >
                                                        <Trash2 size={18} className={styles.deleteIcon} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className={styles.emptyState}>
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

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
                                <h2>{editingUserId ? 'Edit' : 'Add New'} {activeTab}</h2>
                                <button onClick={() => { setShowCreateModal(false); resetForm(); }}><XCircle size={24} /></button>
                            </div>
                            <form onSubmit={handleCreateOrUpdateUser} className={styles.modalForm}>
                                {formError && <div className={styles.errorBanner}>{formError}</div>}

                                <div className={styles.formGroup}>
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                {editingUserId && (
                                    <div className={styles.formGroup}>
                                        <label>Password (Leave blank to keep current)</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                )}

                                {(activeTab === 'Alumni' || activeTab === 'Student') && (
                                    <>
                                        <div className={styles.formGroup}>
                                            <label>Batch Year</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. 2023"
                                                value={formData.batchYear}
                                                onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Department</label>
                                            <select
                                                required
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept._id} value={dept.name}>{dept.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div className={styles.modalFooter}>
                                    <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className={styles.cancelBtn}>Cancel</button>
                                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : (editingUserId ? 'Update User' : 'Create User')}
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

export default UserManagement;
