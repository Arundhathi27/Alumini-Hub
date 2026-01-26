import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        }
    };
};

const notificationService = {
    // Get my notifications
    getMyNotifications: async () => {
        const response = await axios.get(API_URL, getAuthHeader());
        return response.data;
    },

    // Mark as read
    markAsRead: async (id) => {
        const response = await axios.put(`${API_URL}/${id}/read`, {}, getAuthHeader());
        return response.data;
    },

    // Mark related notifications as read
    markRelatedAsRead: async (relatedId) => {
        const response = await axios.put(`${API_URL}/related/${relatedId}/read`, {}, getAuthHeader());
        return response.data;
    },

    // Mark all as read
    markAllAsRead: async () => {
        const response = await axios.put(`${API_URL}/read-all`, {}, getAuthHeader());
        return response.data;
    }
};

export default notificationService;
