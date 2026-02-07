import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Briefcase,
    Linkedin, Globe, Award, Edit2, Save, X,
    CheckCircle, Shield, GraduationCap, Calendar, Droplet, Home, CreditCard
} from 'lucide-react';
import Sidebar from '../../components/alumni/Sidebar';
import Topbar from '../../components/alumni/Topbar';
import { alumniService } from '../../services/alumniService';
import dashboardStyles from './AlumniDashboard.module.css';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Fetch Profile Data
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await alumniService.getProfile();
            setProfile(data);
            initFormData(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const initFormData = (data) => {
        setFormData({
            name: data.user.name,
            phone: data.phone || '',
            about: data.about || '',
            location: data.location || '',
            currentCompany: data.workExperience?.currentCompany || '',
            designation: data.workExperience?.designation || '',
            industry: data.workExperience?.industry || '',
            yearsOfExperience: data.workExperience?.yearsOfExperience || 0,
            skills: data.skills ? data.skills.join(', ') : '',
            linkedin: data.socialLinks?.linkedin || '',
            portfolio: data.socialLinks?.portfolio || '',
            github: data.socialLinks?.github || '',
            // New fields from User model
            registerNo: data.user.registerNo || '',
            dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] : '',
            fullAddress: data.user.fullAddress || '',
            bloodGroup: data.user.bloodGroup || '',
            phoneNumber: data.user.phoneNumber || ''
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const updatedProfile = await alumniService.updateProfile(formData);
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Loading Profile...</div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.container}
        >
            {/* Header / Banner Card */}
            <div className={styles.header}>
                <div className={styles.avatarSection}>
                    {profile.profileImage ? (
                        <img src={profile.profileImage} alt="Profile" className={styles.avatar} />
                    ) : (
                        <div className={styles.avatar}>
                            {profile.user.name.charAt(0)}
                        </div>
                    )}
                </div>

                <div className={styles.infoSection}>
                    <h1 className={styles.name}>{profile.user.name}</h1>
                    <div className={styles.role}>
                        {profile.workExperience?.designation ? (
                            <>{profile.workExperience.designation} at {profile.workExperience.currentCompany}</>
                        ) : (
                            'Alumni Member'
                        )}
                        <span style={{ margin: '0 0.5rem' }}>•</span>
                        {profile.user.batchYear} Batch
                    </div>

                    <div className={styles.badges}>
                        {profile.user.isVerified && (
                            <span className={`${styles.badge} ${styles.verified}`}>
                                <CheckCircle size={14} /> Verified Alumni
                            </span>
                        )}
                        <span className={styles.badge} style={{ background: '#f3f4f6', color: '#374151' }}>
                            {profile.user.department || 'N/A Department'}
                        </span>
                    </div>
                </div>

                <div className={styles.completion}>
                    <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
                        Profile Strength
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${profile.completionPercentage}%` }}
                        />
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#6b7280' }}>
                        {profile.completionPercentage}% Completed
                    </div>
                    {!isEditing && (
                        <button
                            className={styles.btnSecondary}
                            style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit2 size={16} /> Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence mode='wait'>
                {isEditing ? (
                    /* EDIT MODE */
                    <motion.form
                        key="edit-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.formGrid}
                        onSubmit={handleSave}
                    >
                        {/* Personal Info */}
                        <h3 className={styles.sectionTitle}>Personal Information</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Full Name</label>
                            <input
                                className={styles.input}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input
                                className={styles.input}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}>About Me</label>
                            <textarea
                                className={styles.textarea}
                                value={formData.about}
                                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Register No.</label>
                            <input
                                className={styles.input}
                                value={formData.registerNo}
                                onChange={(e) => setFormData({ ...formData, registerNo: e.target.value })}
                                placeholder="Alumni Registration Number"
                                readOnly
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Date of Birth</label>
                            <input
                                type="date"
                                className={styles.input}
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input
                                className={styles.input}
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Blood Group</label>
                            <select
                                className={styles.input}
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}>Full Address</label>
                            <textarea
                                className={styles.textarea}
                                value={formData.fullAddress}
                                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                                placeholder="Complete address..."
                                rows="3"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Location</label>
                            <input
                                className={styles.input}
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="City, Country"
                            />
                        </div>

                        {/* Professional Info */}
                        <h3 className={styles.sectionTitle}>Professional Information</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Current Company</label>
                            <input
                                className={styles.input}
                                value={formData.currentCompany}
                                onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Designation</label>
                            <input
                                className={styles.input}
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Industry</label>
                            <input
                                className={styles.input}
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                placeholder="e.g. Software, Finance"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Experience (Years)</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={formData.yearsOfExperience}
                                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}>Skills (Comma separated)</label>
                            <input
                                className={styles.input}
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                placeholder="Java, React, Python..."
                            />
                        </div>

                        {/* Social Links */}
                        <h3 className={styles.sectionTitle}>Social Links</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>LinkedIn Profile</label>
                            <input
                                className={styles.input}
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Portfolio Website</label>
                            <input
                                className={styles.input}
                                value={formData.portfolio}
                                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                            />
                        </div>

                        <div className={styles.buttonGroup}>
                            <button
                                type="button"
                                className={styles.btnSecondary}
                                onClick={() => setIsEditing(false)}
                            >
                                <X size={18} /> Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.btnPrimary}
                            >
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </motion.form>
                ) : (
                    /* VIEW MODE */
                    <motion.div
                        key="view-mode"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.detailsGrid}
                    >
                        <div className={styles.card}>
                            <h3 className={styles.sectionTitle}>About</h3>
                            <p style={{ color: '#4b5563', lineHeight: 1.6 }}>
                                {profile.about || 'No bio added yet.'}
                            </p>

                            <h3 className={styles.sectionTitle}>Professional Experience</h3>
                            <div className={styles.detailRow}>
                                <Briefcase className={styles.detailIcon} />
                                <div>
                                    <div className={styles.detailValue}>
                                        {profile.workExperience?.designation || 'Role N/A'}
                                    </div>
                                    <div style={{ color: '#6b7280' }}>
                                        {profile.workExperience?.currentCompany || 'Company N/A'} • {profile.workExperience?.yearsOfExperience || 0} Years Exp.
                                    </div>
                                </div>
                            </div>

                            <h3 className={styles.sectionTitle}>Skills</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {profile.skills && profile.skills.length > 0 ? (
                                    profile.skills.map((skill, i) => (
                                        <span key={i} style={{ background: '#eef2ff', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ color: '#9ca3af' }}>No skills listed.</span>
                                )}
                            </div>
                        </div>

                        <div className={styles.card} style={{ height: 'fit-content' }}>
                            <h3 className={styles.sectionTitle}>Contact & Info</h3>

                            <div className={styles.detailRow}>
                                <Mail className={styles.detailIcon} />
                                <div>
                                    <div className={styles.detailLabel}>Email</div>
                                    <div className={styles.detailValue}>{profile.user.email}</div>
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <Phone className={styles.detailIcon} />
                                <div>
                                    <div className={styles.detailLabel}>Phone</div>
                                    <div className={styles.detailValue}>{profile.phone || '-'}</div>
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <CreditCard className={styles.detailIcon} />
                                <div>
                                    <div className={styles.detailLabel}>Register No.</div>
                                    <div className={styles.detailValue}>{profile.user.registerNo || '-'}</div>
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <Calendar className={styles.detailIcon} />
                                <div>
                                    <div className={styles.detailLabel}>Date of Birth</div>
                                    <div className={styles.detailValue}>
                                        {profile.user.dateOfBirth ? new Date(profile.user.dateOfBirth).toLocaleDateString() : '-'}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <Phone className={styles.detailIcon} />
                                <div>
                                    <div className={styles.detailLabel}>Phone Number</div>
                                    <div className={styles.detailValue}>{profile.user.phoneNumber || '-'}</div>
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <Droplet className={styles.detailIcon} />
                                <div>
                                    <div className={styles.detailLabel}>Blood Group</div>
                                    <div className={styles.detailValue}>{profile.user.bloodGroup || '-'}</div>
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <Home className={styles.detailIcon} />
                                <div>
                                    <div className={styles.detailLabel}>Full Address</div>
                                    <div className={styles.detailValue}>{profile.user.fullAddress || '-'}</div>
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <MapPin className={styles.detailIcon} />
                                <div>
                                    <div className={styles.detailLabel}>Location</div>
                                    <div className={styles.detailValue}>{profile.location || '-'}</div>
                                </div>
                            </div>

                            <h3 className={styles.sectionTitle}>Social</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {profile.socialLinks?.linkedin && (
                                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">
                                        <Linkedin style={{ color: '#0077b5', cursor: 'pointer' }} />
                                    </a>
                                )}
                                {profile.socialLinks?.portfolio && (
                                    <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" title="Website">
                                        <Globe style={{ color: '#4b5563', cursor: 'pointer' }} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProfilePage;
