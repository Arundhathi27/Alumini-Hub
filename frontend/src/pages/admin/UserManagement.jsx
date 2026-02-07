import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, Search, Filter, MoreVertical,
    CheckCircle, XCircle, Shield, GraduationCap, Briefcase,
    Loader, Trash2, Edit2, AlertCircle, ArrowLeft, Folder,
    ToggleLeft, ToggleRight, Upload, FileSpreadsheet, Download, FileText
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import BulkUploadModal from '../../components/admin/BulkUploadModal';
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
    const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // New state for filters and bulk operations
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filters, setFilters] = useState({
        verificationStatus: 'all', // all, verified, unverified
        activeStatus: 'all', // all, active, inactive
        filterDepartment: '',
        filterBatch: ''
    });
    const [showFilters, setShowFilters] = useState(false);

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

    // Bulk Operations
    const handleSelectAll = () => {
        const filtered = getFilteredUsers();
        if (selectedUsers.length === filtered.length && filtered.length > 0) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filtered.map(u => u._id));
        }
    };

    const handleSelectUser = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleBulkVerify = async (isVerified) => {
        if (selectedUsers.length === 0) {
            alert('Please select users first');
            return;
        }

        if (!window.confirm(`Are you sure you want to ${isVerified ? 'verify' : 'unverify'} ${selectedUsers.length} user(s)?`)) {
            return;
        }

        try {
            await adminService.bulkVerifyUsers(selectedUsers, isVerified);
            setSelectedUsers([]);
            fetchUsers();
            alert(`Successfully ${isVerified ? 'verified' : 'unverified'} selected users`);
        } catch (error) {
            alert(error.message);
        }
    };

    // Export Functions
    const handleExportExcel = () => {
        const dataToExport = getFilteredUsers().map(user => ({
            Name: user.name,
            Email: user.email,
            Role: user.role,
            Department: user.department || '-',
            Batch: user.batchYear || '-',
            'Register No.': user.registerNo || '-',
            'Date of Birth': user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-',
            'Phone Number': user.phoneNumber || '-',
            'Blood Group': user.bloodGroup || '-',
            Verified: user.isVerified ? 'Yes' : 'No',
            Active: user.isActive ? 'Yes' : 'No'
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `${activeTab}_Users`);
        XLSX.writeFile(wb, `${activeTab}_Users_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const dataToExport = getFilteredUsers();

        doc.setFontSize(18);
        doc.text(`${activeTab} Users`, 14, 20);
        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

        const tableData = dataToExport.map(user => [
            user.name,
            user.email,
            user.department || '-',
            user.batchYear || '-',
            user.isVerified ? 'Yes' : 'No',
            user.isActive ? 'Yes' : 'No'
        ]);

        autoTable(doc, {
            startY: 35,
            head: [['Name', 'Email', 'Department', 'Batch', 'Verified', 'Active']],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [99, 102, 241] }
        });

        doc.save(`${activeTab}_Users_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // Advanced Filtering Logic
    const getFilteredUsers = () => {
        return users.filter(user => {
            // Search term filter
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = !searchTerm ||
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                (user.department && user.department.toLowerCase().includes(searchLower));

            // View mode filtering (backward compatibility with existing drill-down)
            if (viewMode === 'list' && (activeTab === 'Alumni' || activeTab === 'Student')) {
                if (selectedBatch && user.batchYear !== selectedBatch) return false;
                if (selectedDepartment && user.department !== selectedDepartment) return false;
            }

            // Advanced Filters (only apply if set)
            // Verification filter
            const matchesVerification =
                filters.verificationStatus === 'all' ||
                (filters.verificationStatus === 'verified' && user.isVerified) ||
                (filters.verificationStatus === 'unverified' && !user.isVerified);

            // Active status filter
            const matchesActive =
                filters.activeStatus === 'all' ||
                (filters.activeStatus === 'active' && user.isActive) ||
                (filters.activeStatus === 'inactive' && !user.isActive);

            // Department filter
            const matchesDepartment =
                !filters.filterDepartment ||
                user.department === filters.filterDepartment;

            // Batch filter
            const matchesBatch =
                !filters.filterBatch ||
                user.batchYear === filters.filterBatch;

            return matchesSearch && matchesVerification && matchesActive && matchesDepartment && matchesBatch;
        });
    };

    const filteredUsers = getFilteredUsers();



    const handleDownloadSample = () => {
        let headers;
        let sampleData;

        if (activeTab === 'Alumni') {
            // Alumni template with all new fields
            headers = [['Name', 'Email', 'Register No.', 'Batch', 'Department', 'Date of Birth', 'Full Address', 'Blood Group', 'Phone Number']];
            sampleData = [
                {
                    Name: 'John Doe',
                    Email: 'john@example.com',
                    'Register No.': 'ALU2023001',
                    Batch: '2023-2025',
                    Department: 'MCA',
                    'Date of Birth': '1995-05-15',
                    'Full Address': '123 Main Street, City, State - 123456',
                    'Blood Group': 'O+',
                    'Phone Number': '+91 9876543210'
                },
                {
                    Name: 'Jane Smith',
                    Email: 'jane@example.com',
                    'Register No.': 'ALU2024002',
                    Batch: '2024-2026',
                    Department: 'MBA',
                    'Date of Birth': '1996-08-20',
                    'Full Address': '456 Park Avenue, Town, State - 654321',
                    'Blood Group': 'A+',
                    'Phone Number': '+91 9876543211'
                }
            ];
        } else {
            // Student/Staff template with basic fields
            headers = [['Name', 'Email', 'Batch', 'Department']];
            sampleData = [
                { Name: 'John Doe', Email: 'john@example.com', Batch: '2023-2025', Department: 'MCA' },
                { Name: 'Jane Smith', Email: 'jane@example.com', Batch: '2024-2026', Department: 'MBA' }
            ];
        }

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(headers);

        // Add sample data
        XLSX.utils.sheet_add_json(ws, sampleData, { origin: 'A2', skipHeader: true });

        XLSX.utils.book_append_sheet(wb, ws, "Users");
        XLSX.writeFile(wb, `${activeTab}_Upload_Sample.xlsx`);
    };

    const handleBulkUploadClick = () => {
        setShowBulkUploadModal(true);
    };

    const handleModalUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('role', activeTab);

            const res = await adminService.bulkUploadUsers(formData);
            setUploadReport(res.report);
            await fetchUsers();
            alert(`Bulk Upload Complete!\nAdded: ${res.report.added}\nFailed: ${res.report.failed}`);
            setShowBulkUploadModal(false);
        } catch (error) {
            console.error(error);
            alert('Upload failed: ' + error.message);
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



            {/* Filter & Action Toolbar */}
            {
                viewMode === 'list' && (
                    <div className={styles.toolbar} style={{
                        marginBottom: '20px',
                        padding: '15px',
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>

                            {/* Search & Filter Buttons */}
                            <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '300px' }}>
                                <div className={styles.searchWrapper} style={{ flex: 1 }}>
                                    <Search className={styles.searchIcon} size={20} />
                                    <input
                                        type="text"
                                        placeholder={`Search ${activeTab}s...`}
                                        className={styles.searchInput}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button
                                    className={styles.filterButton}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: '1px solid #e5e7eb',
                                        background: showFilters ? '#f3f4f6' : 'white',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter size={18} />
                                    Filters
                                </button>
                            </div>

                            {/* Export Buttons */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={handleExportExcel}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '8px 12px', borderRadius: '6px',
                                        border: '1px solid #10b981', color: '#10b981',
                                        background: 'white', cursor: 'pointer'
                                    }}
                                >
                                    <FileSpreadsheet size={18} /> Excel
                                </button>
                                <button
                                    onClick={handleExportPDF}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '8px 12px', borderRadius: '6px',
                                        border: '1px solid #ef4444', color: '#ef4444',
                                        background: 'white', cursor: 'pointer'
                                    }}
                                >
                                    <FileText size={18} /> PDF
                                </button>
                            </div>
                        </div>

                        {/* Extended Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{ overflow: 'hidden', marginTop: '15px' }}
                                >
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '15px',
                                        paddingTop: '15px',
                                        borderTop: '1px solid #e5e7eb'
                                    }}>
                                        <div className={styles.formGroup}>
                                            <label>Verification Status</label>
                                            <select
                                                value={filters.verificationStatus}
                                                onChange={(e) => setFilters({ ...filters, verificationStatus: e.target.value })}
                                                className={styles.select}
                                            >
                                                <option value="all">All</option>
                                                <option value="verified">Verified</option>
                                                <option value="unverified">Unverified</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Active Status</label>
                                            <select
                                                value={filters.activeStatus}
                                                onChange={(e) => setFilters({ ...filters, activeStatus: e.target.value })}
                                                className={styles.select}
                                            >
                                                <option value="all">All</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Department</label>
                                            <select
                                                value={filters.filterDepartment}
                                                onChange={(e) => setFilters({ ...filters, filterDepartment: e.target.value })}
                                                className={styles.select}
                                            >
                                                <option value="">All Departments</option>
                                                {departments.map(dept => (
                                                    <option key={dept._id} value={dept.name}>{dept.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Batch</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 2024-2026"
                                                value={filters.filterBatch}
                                                onChange={(e) => setFilters({ ...filters, filterBatch: e.target.value })}
                                                className={styles.input}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bulk Action Bar */}
                        <AnimatePresence>
                            {selectedUsers.length > 0 && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    style={{
                                        marginTop: '15px',
                                        padding: '10px 15px',
                                        background: '#f0f9ff',
                                        border: '1px solid #bae6fd',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <span style={{ fontWeight: 500, color: '#0369a1' }}>
                                        {selectedUsers.length} users selected
                                    </span>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {activeTab === 'Alumni' && (
                                            <>
                                                <button
                                                    onClick={() => handleBulkVerify(true)}
                                                    className={styles.actionBtn}
                                                    style={{ background: '#10b981', color: 'white', padding: '5px 10px', width: 'auto' }}
                                                >
                                                    <CheckCircle size={16} /> Verify Selected
                                                </button>
                                                <button
                                                    onClick={() => handleBulkVerify(false)}
                                                    className={styles.actionBtn}
                                                    style={{ background: '#f59e0b', color: 'white', padding: '5px 10px', width: 'auto' }}
                                                >
                                                    <AlertCircle size={16} /> Unverify Selected
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            }

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
            </div>

            {
                viewMode === 'departments' && !isLoading ? (
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
                                        <th style={{ width: '40px', padding: '12px 16px' }}>
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                            />
                                        </th>
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
                                            <tr key={user._id} className={selectedUsers.includes(user._id) ? styles.selectedRow : ''} style={selectedUsers.includes(user._id) ? { background: '#f0f9ff' } : {}}>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => handleSelectUser(user._id)}
                                                        checked={selectedUsers.includes(user._id)}
                                                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                                    />
                                                </td>
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
                                            <td colSpan="6" className={styles.emptyState}>
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )
            }

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
                                            <label>Period of Study (Batch)</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. 2024-2026"
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
            {/* Bulk Upload Modal */}
            <BulkUploadModal
                isOpen={showBulkUploadModal}
                onClose={() => setShowBulkUploadModal(false)}
                onUpload={handleModalUpload}
                role={activeTab}
                departments={departments}
            />
        </div >
    );
};

export default UserManagement;
