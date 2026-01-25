import React, { useState, useEffect } from 'react';
import { UserPlus, X, Users, Briefcase } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { alumniDirectoryService } from '../../services/alumniDirectoryService';
import styles from '../../pages/alumni/AlumniDashboard.module.css';

const StartNewChatModal = ({ isOpen, onClose, onChatRequested }) => {
    const [alumni, setAlumni] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [requesting, setRequesting] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadUsers();
        }
    }, [isOpen]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            // Get alumni
            const alumniData = await alumniDirectoryService.getVerifiedAlumni();
            setAlumni(alumniData);

            // Get staff - you may need to create this endpoint
            // For now, we'll leave staff empty
            setStaff([]);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestChat = async (userId) => {
        try {
            setRequesting(userId);
            await chatService.requestChat(userId);
            alert('Chat request sent successfully! ✅');
            onChatRequested();
            onClose();
        } catch (error) {
            console.error('Error sending chat request:', error);
            const errorMsg = error.response?.data?.message || 'Failed to send chat request';
            alert('❌ Error: ' + errorMsg);
        } finally {
            setRequesting(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '0.75rem',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
                        Start New Chat
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                            Loading users...
                        </div>
                    ) : (
                        <>
                            {/* Alumni Section */}
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '1rem',
                                    color: '#4f46e5'
                                }}>
                                    <Users size={20} />
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                                        Alumni ({alumni.length})
                                    </h3>
                                </div>

                                {alumni.length === 0 ? (
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                        No alumni available
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {alumni.map((person) => (
                                            <div
                                                key={person.user._id}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '1rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem',
                                                    transition: 'border-color 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
                                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#111827' }}>
                                                        {person.user.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                        {person.user.department} • Batch {person.user.batchYear}
                                                    </div>
                                                    {person.currentCompany && (
                                                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                            {person.designation} at {person.currentCompany}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleRequestChat(person.user._id)}
                                                    disabled={requesting === person.user._id}
                                                    className={styles.btnPrimary}
                                                    style={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {requesting === person.user._id ? 'Sending...' : 'Request Chat'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Staff Section */}
                            <div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '1rem',
                                    color: '#10b981'
                                }}>
                                    <Briefcase size={20} />
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                                        Staff ({staff.length})
                                    </h3>
                                </div>

                                {staff.length === 0 ? (
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                        No staff members available
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {staff.map((person) => (
                                            <div
                                                key={person._id}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '1rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem'
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#111827' }}>
                                                        {person.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                        {person.department}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRequestChat(person._id)}
                                                    disabled={requesting === person._id}
                                                    className={styles.btnPrimary}
                                                    style={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {requesting === person._id ? 'Sending...' : 'Request Chat'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StartNewChatModal;
