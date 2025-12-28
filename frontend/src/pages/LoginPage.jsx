import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const role = await login(email, password);
            // Redirect based on role
            switch (role) {
                case 'Admin':
                    navigate('/admin/dashboard');
                    break;
                case 'Staff':
                    navigate('/staff/dashboard');
                    break;
                case 'Alumni':
                    navigate('/alumni/dashboard');
                    break;
                case 'Student':
                    navigate('/student/dashboard');
                    break;
                default:
                    navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className={styles.header}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Award size={48} className={styles.logoIcon} strokeWidth={1.5} />
                    </motion.div>
                    <h1 className={styles.title}>Alumni Hub</h1>
                    <p className={styles.subtitle}>Welcome back! Please access your account.</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            color: '#ef4444',
                            backgroundColor: '#fee2e2',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email Address</label>
                        <div className={styles.inputWrapper}>
                            <Mail className={styles.inputIcon} size={18} />
                            <input
                                id="email"
                                type="email"
                                placeholder="you@university.edu"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} size={18} />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <a href="#" className={styles.forgotPassword}>Forgot Password?</a>

                    <motion.button
                        type="submit"
                        className={styles.button}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span>Signing In...</span>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <LogIn size={18} style={{ marginLeft: '0.5rem' }} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className={styles.footer}>
                    <p>
                        Having trouble accessing? <a href="#" className={styles.contactLink}>Contact Admin</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
