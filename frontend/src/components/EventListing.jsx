import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Link as LinkIcon, Clock, User, X } from 'lucide-react';
import { studentEventService } from '../services/studentEventService';
import { useDebounce } from '../hooks/useDebounce';
import FilterChips from './shared/FilterChips';
import dashboardStyles from '../pages/alumni/AlumniDashboard.module.css';

const EventDetailsModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', borderRadius: '0.5rem', width: '90%', maxWidth: '600px', maxHeight: '90vh',
                overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    padding: '1.5rem', borderBottom: '1px solid #e5e7eb',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>{event.title}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ color: '#4b5563', fontWeight: 500, marginBottom: '0.5rem' }}>{event.type}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <Calendar size={16} /> {event.date} at {event.time}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={16} /> {event.mode} {event.mode === 'Offline' && `- ${event.location}`}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Description</span>
                            <div style={{ color: '#374151', whiteSpace: 'pre-wrap', lineHeight: '1.5', marginTop: '0.5rem' }}>{event.description}</div>
                        </div>

                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Organized By</span>
                            <div style={{ color: '#374151', marginTop: '0.5rem' }}>
                                <User size={16} style={{ display: 'inline-block', marginRight: '0.25rem' }} />
                                {event.postedBy?.name}
                            </div>
                        </div>

                        {event.link && (
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Registration Link</span>
                                <a href={event.link} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', textDecoration: 'underline', marginTop: '0.5rem', display: 'block' }}>
                                    {event.link}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        className={dashboardStyles.btnOutline}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const EventListing = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        title: '',
        type: 'All',
        mode: 'All'
    });
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Debounced filter values
    const debouncedTitle = useDebounce(filters.title, 500);
    const debouncedType = useDebounce(filters.type, 300);
    const debouncedMode = useDebounce(filters.mode, 300);

    useEffect(() => {
        fetchEvents();
    }, [debouncedTitle, debouncedType, debouncedMode]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const filterParams = {};
            if (filters.title) filterParams.title = filters.title;
            if (filters.type !== 'All') filterParams.type = filters.type;
            if (filters.mode !== 'All') filterParams.mode = filters.mode;

            const data = await studentEventService.getApprovedEvents(filterParams);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleRemoveFilter = (key) => {
        setFilters(prev => ({ ...prev, [key]: key === 'title' ? '' : 'All' }));
    };

    const handleClearAll = () => {
        setFilters({
            title: '',
            type: 'All',
            mode: 'All'
        });
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111827' }}>
                Upcoming Events
            </h1>

            {/* Search and Filters */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                        <Search size={16} style={{ display: 'inline-block', marginRight: '0.25rem' }} />
                        Search Events
                    </label>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={filters.title}
                        onChange={(e) => handleFilterChange('title', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                        <Filter size={16} style={{ display: 'inline-block', marginRight: '0.25rem' }} />
                        Event Type
                    </label>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                        }}
                    >
                        <option value="All">All Types</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Meetup">Meetup</option>
                        <option value="Alumni Meet">Alumni Meet</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                        <MapPin size={16} style={{ display: 'inline-block', marginRight: '0.25rem' }} />
                        Mode
                    </label>
                    <select
                        value={filters.mode}
                        onChange={(e) => handleFilterChange('mode', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                        }}
                    >
                        <option value="All">All Modes</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                    </select>
                </div>
            </div>

            {/* Filter Chips */}
            <FilterChips
                activeFilters={filters}
                onRemove={handleRemoveFilter}
                onClearAll={handleClearAll}
            />

            {/* Event Cards */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading events...</div>
            ) : events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <div>No events found.</div>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {events.map((event) => (
                        <div
                            key={event._id}
                            style={{
                                background: 'white',
                                borderRadius: '0.5rem',
                                padding: '1.5rem',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e5e7eb',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    background: '#e0e7ff',
                                    color: '#4338ca',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    marginBottom: '0.75rem'
                                }}>
                                    {event.type}
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
                                    {event.title}
                                </h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} />
                                    <span>{event.date} at {event.time}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={16} />
                                    <span>{event.mode} {event.mode === 'Offline' && `- ${event.location}`}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <User size={16} />
                                    <span>By {event.postedBy?.name}</span>
                                </div>
                            </div>

                            <div style={{
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid #e5e7eb'
                            }}>
                                <button
                                    className={dashboardStyles.btnPrimary}
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedEvent(event);
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <EventDetailsModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </div>
    );
};

export default EventListing;
