import React from 'react';
import { MessageCircle, Briefcase, Calendar, Info, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ notification, onRead }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (!notification.isRead) {
            onRead(notification._id);
        }

        // Navigation logic based on role and type
        // Assume users have access to these routes based on their role
        switch (notification.type) {
            case 'chat_request':
            case 'chat_response':
            case 'message':
                // Determine path based on role? Or just generic /messages
                // Since this is a shared component, we rely on the route existing.
                // Student: /student/messages, Alumni: /alumni/messages
                // A better way is to check the current URL or user role from localStorage
                // But simplified:
                const user = JSON.parse(localStorage.getItem('user'));
                if (user.role === 'Student') navigate('/student/messages');
                else if (user.role === 'Alumni') navigate('/alumni/messages');
                else if (user.role === 'Staff') navigate('/staff/messages');
                break;
            case 'job_status':
                if (JSON.parse(localStorage.getItem('user')).role === 'Alumni') navigate('/alumni/jobs/my-posts');
                break;
            case 'event_status':
                if (JSON.parse(localStorage.getItem('user')).role === 'Alumni') navigate('/alumni/events/my-posts');
                break;
            default:
                break;
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'chat_request': return <MessageCircle size={18} color="#4f46e5" />;
            case 'chat_response':
                return notification.title.includes('Approved')
                    ? <CheckCircle size={18} color="#10b981" />
                    : <XCircle size={18} color="#ef4444" />;
            case 'message': return <MessageCircle size={18} color="#3b82f6" />;
            case 'job_status': return <Briefcase size={18} color="#f59e0b" />;
            case 'event_status': return <Calendar size={18} color="#ec4899" />;
            default: return <Info size={18} color="#6b7280" />;
        }
    };

    return (
        <div
            onClick={handleClick}
            style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                borderBottom: '1px solid #f3f4f6',
                background: notification.isRead ? 'white' : '#f0f9ff',
                cursor: 'pointer',
                transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = notification.isRead ? 'white' : '#f0f9ff'}
        >
            <div style={{ marginTop: '2px' }}>{getIcon()}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827', marginBottom: '2px' }}>
                    {notification.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.4 }}>
                    {notification.message}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '4px' }}>
                    {new Date(notification.createdAt).toLocaleString()}
                </div>
            </div>
            {!notification.isRead && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', alignSelf: 'center' }} />
            )}
        </div>
    );
};

export default NotificationItem;
