import axios from 'axios';

const API_URL = 'http://localhost:5000/api/alumni/jobs';
const JOB_API_URL = 'http://localhost:5000/api/jobs'; // New Verification API

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { 'Authorization': `Bearer ${user.token}` };
    }
    return {};
};

const getAllJobs = async (status) => {
    const config = {
        headers: getAuthHeader(),
        params: status ? { status } : {}
    };
    const response = await axios.get(`${API_URL}/all`, config);
    return response.data;
};

const updateJobStatus = async (id, status) => {
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.put(`${API_URL}/${id}/status`, { status }, config);
    return response.data;
};

// New Day 14 APIs
const getPendingJobs = async () => {
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.get(`${JOB_API_URL}/pending`, config);
    return response.data;
};

const verifyJob = async (jobId, action) => {
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.put(`${JOB_API_URL}/verify`, { jobId, action }, config);
    return response.data;
};

export const adminJobService = {
    getAllJobs,
    updateJobStatus,
    getPendingJobs,
    verifyJob
};
