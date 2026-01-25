import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { chatService } from '../../services/chatService';
import socketService from '../../services/socketService';
import styles from '../../pages/alumni/AlumniDashboard.module.css';

const ChatWindow = ({ conversation, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (conversation) {
            loadMessages();
            socketService.joinConversation(conversation._id);

            // Listen for new messages
            socketService.onMessageReceived((message) => {
                if (message.conversationId === conversation._id) {
                    setMessages(prev => [...prev, message]);
                }
            });

            return () => {
                socketService.leaveConversation(conversation._id);
                socketService.offMessageReceived();
            };
        }
    }, [conversation]);

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
                color: '#6b7280'
            }}>
                Select a conversation to start messaging
            </div>
        );
    }

    const otherUser = conversation.participants.find(p => p._id !== currentUserId);

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Chat Header */}
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                background: 'white'
            }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>
                    {otherUser?.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {otherUser?.role} • {otherUser?.department}
                </p>
            </div>

            {/* Messages Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem',
                background: '#f9fafb'
            }}>
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>No messages yet. Start the conversation!</div>
                ) : (
                    messages.map((message) => {
                        const isMine = message.senderId._id === currentUserId || message.senderId === currentUserId;

                        return (
                            <div
                                key={message._id}
                                style={{
                                    display: 'flex',
                                    justifyContent: isMine ? 'flex-end' : 'flex-start',
                                    marginBottom: '1rem'
                                }}
                            >
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.75rem',
                                    background: isMine ? '#4f46e5' : 'white',
                                    color: isMine ? 'white' : '#111827',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <div style={{ wordWrap: 'break-word' }}>{message.messageText}</div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        marginTop: '0.25rem',
                                        opacity: 0.7
                                    }}>
                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                padding: '1rem 1.5rem',
                borderTop: '1px solid #e5e7eb',
                background: 'white',
                display: 'flex',
                gap: '0.75rem'
            }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none'
                    }}
                />
                <button
                    type="submit"
                    className={styles.btnPrimary}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Send size={18} />
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
