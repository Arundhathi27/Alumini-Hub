import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications, onClose, onRead, onReadAll }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '50px',
            right: '20px',
            width: '360px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            maxHeight: '480px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000
        }}>
            <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 600,
                color: '#111827'
            }}>
                <span>Notifications</span>
                <span
                    onClick={onReadAll}
                    style={{ fontSize: '0.75rem', color: '#4f46e5', cursor: 'pointer', fontWeight: 500 }}
                >
                    Mark all read
                </span>
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
                {notifications.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
                        No notifications yet
                    </div>
                ) : (
                    notifications.map(notification => (
                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                            onRead={onRead}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationList;
