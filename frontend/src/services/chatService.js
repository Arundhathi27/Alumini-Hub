import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chat';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
    };
};

// Student sends chat request
const requestChat = async (targetId) => {
    const response = await axios.post(`${API_URL}/request`, { targetId }, getAuthHeader());
    return response.data;
};

// Get pending requests (Alumni/Staff)
const getPendingRequests = async () => {
    const response = await axios.get(`${API_URL}/requests`, getAuthHeader());
    return response.data;
};

// Respond to request (Approve/Reject)
const respondToRequest = async (requestId, action) => {
    const response = await axios.put(`${API_URL}/request/respond`, { requestId, action }, getAuthHeader());
    return response.data;
};

// Get my conversations
const getConversations = async () => {
    const response = await axios.get(`${API_URL}/conversations`, getAuthHeader());
    return response.data;
};

// Get messages for a conversation
const getMessages = async (conversationId) => {
    const response = await axios.get(`${API_URL}/messages/${conversationId}`, getAuthHeader());
    return response.data;
};

// Admin get all chats
const getAdminChats = async () => {
    const response = await axios.get(`${API_URL}/admin/chats`, getAuthHeader());
    return response.data;
};

export const chatService = {
    requestChat,
    getPendingRequests,
    respondToRequest,
    getConversations,
    getMessages,
    getAdminChats
};
