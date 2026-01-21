import React from 'react';
import { X } from 'lucide-react';

/**
 * FilterChips - Display active filters as removable chips
 * @param {Object} activeFilters - Object of active filters { key: value }
 * @param {Function} onRemove - Callback when removing a filter (key)
 * @param {Function} onClearAll - Callback when clearing all filters
 */
const FilterChips = ({ activeFilters, onRemove, onClearAll }) => {
    const filterEntries = Object.entries(activeFilters).filter(([key, value]) => value && value !== '' && value !== 'All');

    if (filterEntries.length === 0) return null;

    const formatLabel = (key) => {
        const labels = {
            name: 'Name',
            batch: 'Batch',
            company: 'Company',
            role: 'Role',
            location: 'Location',
            skills: 'Skills',
            title: 'Title',
            type: 'Type',
            mode: 'Mode',
            jobType: 'Job Type'
        };
        return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
            padding: '0.75rem 0',
            marginBottom: '1rem'
        }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                Active Filters:
            </span>
            {filterEntries.map(([key, value]) => (
                <div
                    key={key}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.375rem 0.75rem',
                        background: '#e0e7ff',
                        color: '#4338ca',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: 500
                    }}
                >
                    <span>{formatLabel(key)}: {value}</span>
                    <button
                        onClick={() => onRemove(key)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                            color: '#4338ca'
                        }}
                        title="Remove filter"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
            {filterEntries.length > 0 && (
                <button
                    onClick={onClearAll}
                    style={{
                        padding: '0.375rem 0.75rem',
                        background: 'transparent',
                        color: '#dc2626',
                        border: '1px solid #dc2626',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#dc2626';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#dc2626';
                    }}
                >
                    Clear All
                </button>
            )}
        </div>
    );
};

export default FilterChips;
