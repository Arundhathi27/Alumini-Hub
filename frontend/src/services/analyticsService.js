import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/analytics';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        }
    };
};

const analyticsService = {
    getSummary: async () => {
        const response = await axios.get(`${API_URL}/summary`, getAuthHeader());
        return response.data;
    },

    getUserAnalytics: async () => {
        const response = await axios.get(`${API_URL}/users`, getAuthHeader());
        return response.data;
    },

    getJobAnalytics: async () => {
        const response = await axios.get(`${API_URL}/jobs`, getAuthHeader());
        return response.data;
    },

    getEventAnalytics: async () => {
        const response = await axios.get(`${API_URL}/events`, getAuthHeader());
        return response.data;
    },

    getChatAnalytics: async () => {
        const response = await axios.get(`${API_URL}/chats`, getAuthHeader());
        return response.data;
    }
};

export default analyticsService;
