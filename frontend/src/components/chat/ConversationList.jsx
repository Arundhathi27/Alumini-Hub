import React, { useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import Avatar from './Avatar';

const ConversationList = ({ conversations, selectedConversation, onSelectConversation, currentUserId }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConversations = conversations.filter(conv => {
        const otherUser = conv.participants.find(p => String(p._id) !== String(currentUserId));
        return (otherUser?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (conversations.length === 0) {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6b7280',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#e0e7ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                }}>
                    <MessageCircle size={32} color="#4f46e5" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>No messages yet</h3>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Start a new chat to connect with others.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f9fafb' }}>
            {/* Search Bar */}
            <div style={{ padding: '1rem 1.5rem', background: 'white', borderBottom: '1px solid #e5e7eb', position: 'relative', zIndex: 10 }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.625rem 1rem 0.625rem 2.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            outline: 'none',
                            background: '#f9fafb',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.borderColor = '#4f46e5';
                            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.background = '#f9fafb';
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                {filteredConversations.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                        No conversations found
                    </div>
                ) : (
                    filteredConversations.map((conversation) => {
                        const otherUser = conversation.participants.find(p => String(p._id) !== String(currentUserId));
                        const isSelected = selectedConversation?._id === conversation._id;

                        // Check if online (mocked for now, logic can be added)
                        const isOnline = false;

                        return (
                            <div
                                key={conversation._id}
                                onClick={() => onSelectConversation(conversation)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem 1.5rem',
                                    borderBottom: '1px solid #f3f4f6',
                                    cursor: 'pointer',
                                    background: isSelected ? 'white' : 'transparent',
                                    borderLeft: isSelected ? '4px solid #4f46e5' : '4px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) e.currentTarget.style.background = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{ position: 'relative', marginRight: '1rem' }}>
                                    <Avatar name={otherUser?.name} size={48} />
                                    {isOnline && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '2px',
                                            right: '2px',
                                            width: '12px',
                                            height: '12px',
                                            background: '#10b981',
                                            borderRadius: '50%',
                                            border: '2px solid white'
                                        }} />
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <div style={{
                                            fontWeight: isSelected ? 700 : 600,
                                            color: '#111827',
                                            fontSize: '0.95rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {otherUser?.name || 'Unknown User'}
                                        </div>
                                        {conversation.lastMessageAt && (
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', flexShrink: 0, marginLeft: '0.5rem' }}>
                                                {new Date(conversation.lastMessageAt).toLocaleDateString() === new Date().toLocaleDateString()
                                                    ? new Date(conversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : new Date(conversation.lastMessageAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: '#6b7280',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '160px'
                                        }}>
                                            {conversation.lastMessage || 'Start the conversation'}
                                        </div>
                                        {/* Unread badge mock */}
                                        {/* <div style={{ background: '#4f46e5', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '1rem' }}>2</div> */}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ConversationList;
