import axios from 'axios';

const API_URL = 'http://localhost:5000/api/alumni/events';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

const createEvent = async (eventData) => {
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.post(API_URL, eventData, config);
    return response.data;
};

const getMyEvents = async () => {
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

export const eventService = {
    createEvent,
    getMyEvents
};
