import axios from 'axios';

const API_URL = 'http://localhost:5000/api/alumni/jobs';

const getMyJobs = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const createJob = async (jobData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
    const response = await axios.post(API_URL, jobData, config);
    return response.data;
};

export const jobService = {
    getMyJobs,
    createJob,
};
