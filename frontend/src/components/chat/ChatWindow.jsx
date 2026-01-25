import React, { useState, useEffect, useRef } from 'react';
import { Send, Check, CheckCheck, MoreVertical, Phone, Video } from 'lucide-react';
import { chatService } from '../../services/chatService';
import socketService from '../../services/socketService';
import Avatar from './Avatar';
import styles from '../../pages/alumni/AlumniDashboard.module.css';

const ChatWindow = ({ conversation, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(false); // New: Online status state
    const messagesEndRef = useRef(null);

    // Robust way to find the 'other' user. 
    const otherUser = conversation?.participants.find(p => String(p._id) !== String(currentUserId));

    useEffect(() => {
        if (conversation) {
            loadMessages();
            socketService.joinConversation(conversation._id);

            // Listen for new messages
            socketService.onMessageReceived((message) => {
                if (message.conversationId === conversation._id) {
                    setMessages((prev) => {
                        if (prev.some(m => m._id === message._id)) return prev;
                        return [...prev, message];
                    });

                    const isMine = String(message.senderId._id || message.senderId) === String(currentUserId);
                    if (!isMine) {
                        socketService.markMessageRead(message._id);
                    }
                }
            });

            // Listen for read status updates
            socketService.onMessageReadStatus(({ messageId, isRead }) => {
                setMessages(prev => prev.map(msg =>
                    msg._id === messageId ? { ...msg, isRead } : msg
                ));
            });

            // NEW: Listen for user online status (logic needs to be added to backend, but we prep UI)
            // For now, let's assume if we get a message, they are online :)
            // Or we can mock it as "true" for demo if backend isn't ready.
            // setIsOnline(true); 

            return () => {
                socketService.leaveConversation(conversation._id);
                socketService.offMessageReceived();
            };
        }
    }, [conversation, currentUserId]);

    useEffect(() => {
        if (!loading && messages.length > 0) {
            messages.forEach(msg => {
                const isMine = String(msg.senderId._id || msg.senderId) === String(currentUserId);
                if (!isMine && !msg.isRead) {
                    socketService.markMessageRead(msg._id);
                }
            });
        }
    }, [messages, loading, currentUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const data = await chatService.getMessages(conversation._id);
            setMessages(data);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        socketService.sendMessage(conversation._id, newMessage.trim());
        setNewMessage('');
    };

    if (!conversation) {
        return (
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                background: '#f9fafb',
                flexDirection: 'column'
            }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    background: '#f3f4f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <Send size={48} color="#d1d5db" />
                </div>
                <h2 style={{ fontSize: '1.5rem', color: '#374151', fontWeight: 600 }}>Welcome to Messages</h2>
                <p style={{ marginTop: '0.5rem' }}>Select a chat from the sidebar to start messaging.</p>
            </div>
        );
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
            {/* Chat Header */}
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Avatar name={otherUser?.name} size={44} />
                        {/* Online Indicator */}
                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            width: '12px',
                            height: '12px',
                            background: isOnline ? '#10b981' : '#d1d5db', // Green or Grey
                            borderRadius: '50%',
                            border: '2px solid white'
                        }} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                            {otherUser?.name || 'User'}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: isOnline ? '#10b981' : '#6b7280', fontWeight: 500 }}>
                            {isOnline ? 'Online' : `${otherUser?.role} • ${otherUser?.department}`}
                        </p>
                    </div>
                </div>

                {/* Header Actions (Visual Only) */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '50%' }}>
                        <Phone size={20} />
                    </button>
                    <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '50%' }}>
                        <Video size={20} />
                    </button>
                    <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '50%' }}>
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div style={{
                flex: 1,
                minHeight: 0, // Critical for flex scrolling
                overflowY: 'auto',
                padding: '2rem',
                background: '#f8fafc', // Very subtle blue-grey
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        color: '#9ca3af',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Avatar name={otherUser?.name} size={80} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isMine = String(message.senderId._id || message.senderId) === String(currentUserId);
                        const showAvatar = !isMine && (index === 0 || messages[index - 1].senderId._id !== message.senderId._id);

                        return (
                            <div
                                key={message._id}
                                style={{
                                    display: 'flex',
                                    justifyContent: isMine ? 'flex-end' : 'flex-start',
                                    alignItems: 'flex-end',
                                    paddingLeft: isMine ? '20%' : '0',
                                    paddingRight: isMine ? '0' : '20%',
                                }}
                            >
                                {!isMine && (
                                    <div style={{ width: '32px', marginRight: '0.75rem' }}>
                                        {showAvatar ? (
                                            <Avatar name={otherUser?.name} size={32} />
                                        ) : (
                                            <div style={{ width: '32px' }} />
                                        )}
                                    </div>
                                )}

                                <div style={{
                                    padding: '0.75rem 1.25rem',
                                    borderRadius: '1.25rem',
                                    borderBottomRightRadius: isMine ? '0.25rem' : '1.25rem',
                                    borderBottomLeftRadius: !isMine ? '0.25rem' : '1.25rem',
                                    background: isMine ? '#4f46e5' : 'white',
                                    color: isMine ? 'white' : '#1e293b',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                    position: 'relative'
                                }}>
                                    <div style={{ wordWrap: 'break-word', lineHeight: 1.5 }}>
                                        {message.messageText}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        gap: '0.25rem',
                                        fontSize: '0.7rem',
                                        marginTop: '0.25rem',
                                        opacity: 0.8,
                                        color: isMine ? 'rgba(255,255,255,0.9)' : '#94a3b8'
                                    }}>
                                        <span>
                                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMine && (
                                            <span style={{ display: 'flex', alignItems: 'center', marginLeft: '2px' }}>
                                                {message.isRead ? (
                                                    <CheckCheck size={14} strokeWidth={2.5} color="#93c5fd" />
                                                ) : (
                                                    <Check size={14} strokeWidth={2.5} color="rgba(255,255,255,0.7)" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} style={{
                padding: '1.25rem',
                background: 'white',
                borderTop: '1px solid #f1f5f9',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: '#f8fafc',
                    padding: '0.5rem',
                    borderRadius: '1rem',
                    border: '1px solid #e2e8f0',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#4f46e5';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        style={{
                            flex: 1,
                            padding: '0.5rem 1rem',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '0.95rem',
                            outline: 'none',
                            color: '#1e293b'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            background: newMessage.trim() ? '#4f46e5' : '#e2e8f0',
                            color: 'white',
                            borderRadius: '50%',
                            border: 'none',
                            cursor: newMessage.trim() ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                            flexShrink: 0
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
