import React from 'react';

const Avatar = ({ name, size = 48, className = '' }) => {
    const initials = name
        ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    const colors = [
        '#ef4444', '#f97316', '#f59e0b', '#84cc16',
        '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
        '#8b5cf6', '#d946ef', '#f43f5e'
    ];

    // Simple hash to get consistent color
    const charCode = name ? name.charCodeAt(0) : 0;
    const bgColor = colors[charCode % colors.length];

    return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: bgColor,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: size * 0.4,
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                flexShrink: 0
            }}
        >
            {initials}
        </div>
    );
};

export default Avatar;
