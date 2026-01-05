const API_URL = 'http://localhost:5000/api/alumni';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' };
    }
    return { 'Content-Type': 'application/json' };
};

export const alumniService = {
    getProfile: async () => {
        const response = await fetch(`${API_URL}/profile`, {
            headers: getAuthHeader()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
        return data;
    },

    updateProfile: async (profileData) => {
        const response = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(profileData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update profile');
        return data;
    }
};
