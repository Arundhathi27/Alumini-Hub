import React from 'react';
import { Bell } from 'lucide-react';

const NotificationBell = ({ count, onClick }) => {
    return (
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onClick}>
            <Bell size={24} color="#6b7280" />
            {count > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-4px',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '1px 5px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    minWidth: '20px',
                    textAlign: 'center'
                }}>
                    {count > 99 ? '99+' : count}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
