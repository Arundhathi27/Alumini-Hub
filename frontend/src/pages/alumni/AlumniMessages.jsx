import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Check, X, UserCheck } from 'lucide-react';
import { chatService } from '../../services/chatService';
import socketService from '../../services/socketService';
import ConversationList from '../../components/chat/ConversationList';
import ChatWindow from '../../components/chat/ChatWindow';

const AlumniMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        socketService.connect(currentUser.token);
        loadData();
        return () => { socketService.disconnect(); };
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [convs, requests] = await Promise.all([
                chatService.getConversations(),
                chatService.getPendingRequests()
            ]);
            setConversations(convs);
            setPendingRequests(requests);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            await chatService.respondToRequest(requestId, 'approve');
            loadData();
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await chatService.respondToRequest(requestId, 'reject');
            loadData();
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    /* Same layout strategy as StudentMessages:
       margin: -1.75rem -2rem escapes parent .content padding
       height: calc(100vh - 68px) fills exactly below the topbar
       overflow: hidden — only inner message list scrolls */
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

            {/* ── Top header ── */}
            <div style={{ padding: '1.25rem 2rem 0.875rem', flexShrink: 0, background: '#f0f4fb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: pendingRequests.length > 0 ? '0.875rem' : 0 }}>
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
                </div>

                {/* Pending Chat Requests — only shown for alumni */}
                <AnimatePresence>
                    {pendingRequests.length > 0 && (
                        <motion.div
                            key="pending"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            style={{
                                background: '#fff',
                                border: '1px solid #bfdbfe',
                                borderRadius: '0.875rem',
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            }}
                        >
                            <div style={{
                                background: 'linear-gradient(135deg,#eff6ff,#e0e7ff)',
                                padding: '0.65rem 1.25rem',
                                borderBottom: '1px solid #bfdbfe',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}>
                                <UserCheck size={14} color="#2563eb" />
                                <span style={{ fontWeight: 700, color: '#1e40af', fontSize: '0.8125rem' }}>
                                    Pending Chat Requests
                                </span>
                                <span style={{ background: '#2563eb', color: '#fff', borderRadius: 999, padding: '0.1rem 0.5rem', fontSize: '0.68rem', fontWeight: 700 }}>
                                    {pendingRequests.length}
                                </span>
                            </div>
                            <div>
                                {pendingRequests.map((request, i) => {
                                    const initial = (request.requesterId.name || 'U').charAt(0).toUpperCase();
                                    return (
                                        <motion.div key={request._id}
                                            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '0.75rem 1.25rem',
                                                borderBottom: i < pendingRequests.length - 1 ? '1px solid #f3f4f6' : 'none',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: 34, height: 34, borderRadius: '50%',
                                                    background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
                                                    color: '#fff', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                                                }}>
                                                    {initial}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.875rem' }}>{request.requesterId.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.1rem' }}>
                                                        {request.requesterId.role}{request.requesterId.department && ` • ${request.requesterId.department}`}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                                                    onClick={() => handleApprove(request._id)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.375rem 0.875rem', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.775rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
                                                    <Check size={12} /> Accept
                                                </motion.button>
                                                <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                                                    onClick={() => handleReject(request._id)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.375rem 0.875rem', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.775rem', cursor: 'pointer' }}>
                                                    <X size={12} /> Decline
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Chat area — identical structure to StudentMessages ── */}
            <div style={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'row',
                background: '#fff',
                borderTop: '1px solid #e5e7eb',
                overflow: 'hidden',
            }}>
                {/* Conversation list sidebar */}
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
        </div>
    );
};

export default AlumniMessages;
