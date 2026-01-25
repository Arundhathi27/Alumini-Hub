import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { chatService } from '../../services/chatService';
import socketService from '../../services/socketService';
import ConversationList from '../../components/chat/ConversationList';
import ChatWindow from '../../components/chat/ChatWindow';
import StartNewChatModal from '../../components/chat/StartNewChatModal';

const StudentMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Connect socket
        socketService.connect(currentUser.token);

        loadConversations();

        return () => {
            socketService.disconnect();
        };
    }, []);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await chatService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827' }}>
                    Messages
                </h1>
                <button
                    onClick={() => setShowNewChatModal(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: '#4f46e5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#4338ca'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#4f46e5'}
                >
                    <UserPlus size={18} />
                    Start New Chat
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '350px 1fr',
                gap: '1.5rem',
                height: 'calc(100vh - 200px)',
                background: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                {/* Conversations List */}
                <div style={{ borderRight: '1px solid #e5e7eb', overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                            Loading conversations...
                        </div>
                    ) : (
                        <ConversationList
                            conversations={conversations}
                            selectedConversation={selectedConversation}
                            onSelectConversation={setSelectedConversation}
                            currentUserId={currentUser.id}
                        />
                    )}
                </div>

                {/* Chat Window */}
                <ChatWindow
                    conversation={selectedConversation}
                    currentUserId={currentUser.id}
                />
            </div>

            {/* Start New Chat Modal */}
            <StartNewChatModal
                isOpen={showNewChatModal}
                onClose={() => setShowNewChatModal(false)}
                onChatRequested={loadConversations}
            />
        </div>
    );
};

export default StudentMessages;
