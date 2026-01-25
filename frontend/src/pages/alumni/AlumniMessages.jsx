import React, { useState, useEffect } from 'react';
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

        return () => {
            socketService.disconnect();
        };
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [convs, requests] = await Promise.all([
                chatService.getConversations(),
                chatService.getPendingRequests()
            ]);
            console.log('Loaded conversations:', convs);
            console.log('Loaded pending requests:', requests);
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
            loadData(); // Reload to show new conversation
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

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111827' }}>
                Messages
            </h1>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
                <div style={{
                    marginBottom: '1.5rem',
                    background: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '0.5rem',
                    padding: '1rem'
                }}>
                    <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: '#92400e' }}>
                        Pending Chat Requests ({pendingRequests.length})
                    </h3>
                    {pendingRequests.map(request => (
                        <div key={request._id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem',
                            background: 'white',
                            borderRadius: '0.375rem',
                            marginBottom: '0.5rem'
                        }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>{request.requesterId.name}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    {request.requesterId.role} • {request.requesterId.department}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleApprove(request._id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer',
                                        fontWeight: 500
                                    }}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(request._id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer',
                                        fontWeight: 500
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Conversations */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '350px 1fr',
                gap: '1.5rem',
                height: '75vh', // Fixed height relative to viewport
                background: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                            Loading...
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

                <ChatWindow
                    conversation={selectedConversation}
                    currentUserId={currentUser._id}
                />
            </div>
        </div>
    );
};

export default AlumniMessages;
