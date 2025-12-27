import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session on load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Determine connection based on email for testing (MOCK LOGIC)
        let role = 'Student'; // Default
        const email = userData.email.toLowerCase();

        if (email.includes('admin')) role = 'Admin';
        else if (email.includes('staff')) role = 'Staff';
        else if (email.includes('alumni')) role = 'Alumni';
        else if (email.includes('student')) role = 'Student';

        const userWithRole = { ...userData, role };
        setUser(userWithRole);
        localStorage.setItem('user', JSON.stringify(userWithRole));
        return role;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
