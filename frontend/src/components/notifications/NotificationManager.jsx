import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBell from './NotificationBell';
import NotificationList from './NotificationList';

const NotificationManager = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleRead = (id) => {
        markAsRead(id);
        // Don't close list, user might want to read more
    };

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <NotificationBell
                count={unreadCount}
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
                <NotificationList
                    notifications={notifications}
                    onClose={() => setIsOpen(false)}
                    onRead={handleRead}
                    onReadAll={markAllAsRead}
                />
            )}
        </div>
    );
};

export default NotificationManager;
