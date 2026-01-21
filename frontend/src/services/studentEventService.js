import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

const getApprovedEvents = async (filters = {}) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        params: filters // { title, type, mode }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

export const studentEventService = {
    getApprovedEvents,
};
