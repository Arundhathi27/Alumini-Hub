import axios from 'axios';

const API_URL = 'http://localhost:5000/api/jobs';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

const getApprovedJobs = async (filters = {}) => {
    const config = {
        headers: getAuthHeader(),
        params: filters
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

export const studentJobService = {
    getApprovedJobs
};
