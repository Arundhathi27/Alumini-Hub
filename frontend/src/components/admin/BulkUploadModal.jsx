import React, { useState, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, AlertCircle, FileSpreadsheet, Loader } from 'lucide-react';
import styles from './BulkUploadModal.module.css';

const BulkUploadModal = ({ isOpen, onClose, onUpload, role, departments = [] }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]); // Array of { ...row, isValid, errors }
    const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 });
    const [step, setStep] = useState('upload'); // 'upload' | 'preview' | 'uploading'
    const fileInputRef = useRef(null);

    // Reset state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setFile(null);
            setPreviewData([]);
            setStats({ total: 0, valid: 0, invalid: 0 });
            setStep('upload');
        }
    }, [isOpen]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const validateRow = (row) => {
        const errors = [];
        // Basic Validation
        if (!row.Name || !row.Name.toString().trim()) errors.push('Missing Name');
        if (!row.Email || !row.Email.toString().trim()) errors.push('Missing Email');

        // Simple regex for email
        if (row.Email && !/\S+@\S+\.\S/.test(row.Email)) errors.push('Invalid Email Format');

        // Department Validation (only if Department column exists or is required)
        if (role === 'Alumni' || role === 'Student') {
            if (!row.Department || !row.Department.toString().trim()) {
                errors.push('Missing Department');
            } else {
                const validDept = departments.some(d => d.name.toLowerCase() === row.Department.toString().trim().toLowerCase());
                if (!validDept) {
                    errors.push(`Invalid Dept: ${row.Department}`);
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    const processFile = (selectedFile) => {
        if (!selectedFile) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            let validCount = 0;
            let invalidCount = 0;

            const processedData = jsonData.map((row, index) => {
                const { isValid, errors } = validateRow(row);
                if (isValid) validCount++;
                else invalidCount++;

                return {
                    id: index,
                    ...row,
                    isValid,
                    errorMessage: errors.join(', ')
                };
            });

            setFile(selectedFile);
            setPreviewData(processedData);
            setStats({
                total: processedData.length,
                valid: validCount,
                invalid: invalidCount
            });
            setStep('preview');
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        setStep('uploading');

        // Filter only valid rows
        const validRows = previewData.filter(row => row.isValid).map(({ id, isValid, errorMessage, ...rest }) => rest);

        if (validRows.length === 0) {
            alert('No valid users to upload.');
            setStep('preview');
            return;
        }

        // Create a new Excel file in memory
        const ws = XLSX.utils.json_to_sheet(validRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ValidUsers");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Use the original file name but pre-validated
        const processedFile = new File([blob], file.name, { type: file.type });

        await onUpload(processedFile);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className={styles.modal}>
                    <div className={styles.header}>
                        <h2>Bulk Upload {role}s</h2>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>

                    <div className={styles.content}>
                        {step === 'upload' && (
                            <div
                                className={`${styles.dropZone} ${dragActive ? styles.dropZoneActive : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                />
                                <div className={styles.uploadIconWrapper}>
                                    <Upload size={32} />
                                </div>
                                <p className={styles.uploadText}>Click to upload or drag and drop</p>
                                <p className={styles.uploadSubtext}>Excel files only (.xlsx, .xls)</p>
                            </div>
                        )}

                        {step === 'preview' && (
                            <>
                                <div className={styles.statsBar}>
                                    <div className={styles.statCard} style={{ background: '#f3f4f6' }}>
                                        <span className={styles.statLabel}>Total Parsed</span>
                                        <span className={styles.statValue}>{stats.total}</span>
                                    </div>
                                    <div className={styles.statCard} style={{ background: '#dcfce7', color: '#166534' }}>
                                        <span className={styles.statLabel}>Valid Users</span>
                                        <span className={styles.statValue}>{stats.valid}</span>
                                    </div>
                                    <div className={styles.statCard} style={{ background: '#fee2e2', color: '#991b1b' }}>
                                        <span className={styles.statLabel}>Invalid Users</span>
                                        <span className={styles.statValue}>{stats.invalid}</span>
                                    </div>
                                </div>

                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Status</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Department</th>
                                                <th>Error</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row) => (
                                                <tr key={row.id} className={row.isValid ? styles.rowValid : styles.rowInvalid}>
                                                    <td>
                                                        {row.isValid ? (
                                                            <span className={`${styles.statusBadge} ${styles.validBadge}`}>
                                                                <CheckCircle size={12} /> Valid
                                                            </span>
                                                        ) : (
                                                            <span className={`${styles.statusBadge} ${styles.invalidBadge}`}>
                                                                <AlertCircle size={12} /> Invalid
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>{row.Name}</td>
                                                    <td>{row.Email}</td>
                                                    <td>{row.Department || '-'}</td>
                                                    <td style={{ color: '#ef4444' }}>{row.errorMessage}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {step === 'uploading' && (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Loader size={48} className="animate-spin text-indigo-600 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700">Uploading Valid Users...</h3>
                                <p className="text-gray-500">Please wait while we process your request.</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button className={styles.secondaryBtn} onClick={onClose}>
                            Cancel
                        </button>
                        {step === 'preview' && (
                            <button
                                className={styles.primaryBtn}
                                onClick={handleUpload}
                                disabled={stats.valid === 0}
                            >
                                <Upload size={18} />
                                Upload {stats.valid} Valid Users
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BulkUploadModal;
