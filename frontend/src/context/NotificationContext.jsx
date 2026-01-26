import React, { createContext, useContext, useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import socketService from '../services/socketService';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!currentUser?.token) return;

        // Ensure socket is connected
        if (!socketService.socket?.connected) {
            socketService.connect(currentUser.token);
        }

        // Load initial notifications
        loadNotifications();

        // Listen for new notifications via socket
        const handleNewNotification = (notification) => {
            console.log('New notification received:', notification);
            // Add to top of list
            setNotifications(prev => [notification, ...prev]);
            // Increment unread count
            setUnreadCount(prev => prev + 1);

            // Optional: Play sound or show toast
        };

        socketService.on('notification:new', handleNewNotification);

        return () => {
            socketService.off('notification:new', handleNewNotification);
        };
    }, [currentUser?.token]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const { notifications: data, unreadCount: count } = await notificationService.getMyNotifications();
            setNotifications(data);
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            // Optimistic update
            const updated = notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            );
            setNotifications(updated);
            setUnreadCount(prev => Math.max(0, prev - 1));

            await notificationService.markAsRead(id);
        } catch (error) {
            console.error('Failed to mark read:', error);
            // Revert on error?
        }
    };

    const markRelatedAsRead = async (relatedId) => {
        try {
            // Optimistic update
            const updated = notifications.map(n =>
                n.relatedId === relatedId ? { ...n, isRead: true } : n
            );

            // Calculate how many we are marking as read to update count accurately
            const countMarked = notifications.filter(n => n.relatedId === relatedId && !n.isRead).length;

            setNotifications(updated);
            setUnreadCount(prev => Math.max(0, prev - countMarked));

            await notificationService.markRelatedAsRead(relatedId);
        } catch (error) {
            console.error('Failed to mark related as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            await notificationService.markAllAsRead();
        } catch (error) {
            console.error('Failed to mark all read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            markAsRead,
            markRelatedAsRead,
            markAllAsRead,
            loadNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
