import axios from 'axios';

const API_URL = 'http://localhost:5000/api/alumni';

const getVerifiedAlumni = async (filters = {}) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        params: filters // { name, batch, company, role, location, skills }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

export const alumniDirectoryService = {
    getVerifiedAlumni,
};
