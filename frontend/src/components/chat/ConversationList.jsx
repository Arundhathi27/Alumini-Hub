import React from 'react';
import { MessageCircle } from 'lucide-react';

const ConversationList = ({ conversations, selectedConversation, onSelectConversation, currentUserId }) => {
    if (conversations.length === 0) {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6b7280'
            }}>
                <MessageCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <div>No conversations yet</div>
            </div>
        );
    }

    return (
        <div style={{ overflowY: 'auto' }}>
            {conversations.map((conversation) => {
                const otherUser = conversation.participants.find(p => p._id !== currentUserId);
                const isSelected = selectedConversation?._id === conversation._id;

                return (
                    <div
                        key={conversation._id}
                        onClick={() => onSelectConversation(conversation)}
                        style={{
                            padding: '1rem 1.5rem',
                            borderBottom: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            background: isSelected ? '#f3f4f6' : 'white',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'white';
                        }}
                    >
                        <div style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>
                            {otherUser?.name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {otherUser?.role} • {otherUser?.department}
                        </div>
                        {conversation.lastMessage && (
                            <div style={{
                                fontSize: '0.875rem',
                                color: '#9ca3af',
                                marginTop: '0.5rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {conversation.lastMessage}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ConversationList;
