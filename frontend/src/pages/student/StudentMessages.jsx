import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, UserPlus } from 'lucide-react';
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
        socketService.connect(currentUser.token);
        loadConversations();
        return () => { socketService.disconnect(); };
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

    /*
     * LAYOUT: negative margin escapes the parent .content padding.
     * height: calc(100vh - 68px) = viewport minus topbar.
     * overflow: hidden so only inner chat list scrolls, nothing else.
     */
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '-1.75rem -2rem',
            height: 'calc(100vh - 68px)',
            minHeight: 0,
            overflow: 'hidden',
            boxSizing: 'border-box',
        }}>

            {/* ── Top header (has padding) ── */}
            <div style={{ padding: '1.25rem 2rem 0.875rem', flexShrink: 0, background: '#f0f4fb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 34, height: 34, background: '#eff6ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MessageSquare size={17} color="#2563eb" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.4px' }}>
                                Messages
                            </h2>
                            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.1rem' }}>
                                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowNewChatModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1.125rem',
                            background: 'linear-gradient(135deg,#2563eb,#3b82f6)',
                            color: '#fff', border: 'none', borderRadius: '0.625rem',
                            fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                        }}
                    >
                        <UserPlus size={15} /> New Chat
                    </motion.button>
                </div>
            </div>

            {/* ── Chat area — flex row so children get bounded heights ── */}
            <div style={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'row',
                background: '#fff',
                borderTop: '1px solid #e5e7eb',
                overflow: 'hidden',
            }}>
                {/* Conversation list */}
                <div style={{
                    width: 300,
                    flexShrink: 0,
                    borderRight: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    minHeight: 0,
                }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                style={{ width: 24, height: 24, border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', margin: '0 auto' }}
                            />
                        </div>
                    ) : (
                        <ConversationList
                            conversations={conversations}
                            selectedConversation={selectedConversation}
                            onSelectConversation={setSelectedConversation}
                            currentUserId={currentUser._id}
                        />
                    )}
                </div>

                {/* Chat window wrapper — bounded flex child so only messages scroll */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                    <ChatWindow
                        conversation={selectedConversation}
                        currentUserId={currentUser._id}
                    />
                </div>
            </div>

            <StartNewChatModal
                isOpen={showNewChatModal}
                onClose={() => setShowNewChatModal(false)}
                onChatRequested={loadConversations}
            />
        </div>
    );
};

export default StudentMessages;
