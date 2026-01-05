import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

const getPendingEvents = async () => {
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.get(`${API_URL}/pending`, config);
    return response.data;
};

const verifyEvent = async (eventId, action) => {
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.put(`${API_URL}/verify`, { eventId, action }, config);
    return response.data;
};

export const adminEventService = {
    getPendingEvents,
    verifyEvent
};
