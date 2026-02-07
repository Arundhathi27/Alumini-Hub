const API_URL = 'http://localhost:5000/api/admin';

// Helper to get token
const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
    };
};

export const adminService = {
    createUser: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/create-user`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create user');
            return data;
        } catch (error) {
            throw error;
        }
    },

    getUsers: async (role) => {
        try {
            const response = await fetch(`${API_URL}/users?role=${role}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
            return data;
        } catch (error) {
            throw error;
        }
    },

    verifyAlumni: async (id, isVerified) => {
        try {
            const response = await fetch(`${API_URL}/verify-alumni/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ isVerified }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to verify alumni');
            return data;
        } catch (error) {
            throw error;
        }
    },

    activateUser: async (id, isActive) => {
        try {
            const response = await fetch(`${API_URL}/activate-user/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ isActive }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update status');
            return data;
        } catch (error) {
            throw error;
        }
    },

    createDepartment: async (name) => {
        try {
            const response = await fetch(`${API_URL}/create-department`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ name }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create department');
            return data;
        } catch (error) {
            throw error;
        }
    },

    getDepartments: async () => {
        try {
            const response = await fetch(`${API_URL}/departments`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch departments');
            return data;
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (id, userData) => {
        try {
            const response = await fetch(`${API_URL}/update-user/${id}`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update user');
            return data;
        } catch (error) {
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await fetch(`${API_URL}/delete-user/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to delete user');
            return data;
        } catch (error) {
            throw error;
        }
    },

    bulkUploadUsers: async (formData) => {
        try {
            // No Content-Type header - browser sets it with boundary for FormData
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`${API_URL}/bulk-upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                },
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to populate users');
            return data;
        } catch (error) {
            throw error;
        }
    },

    bulkVerifyUsers: async (userIds, isVerified) => {
        try {
            const response = await fetch(`${API_URL}/users/bulk-verify`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ userIds, isVerified }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to verify users');
            return data;
        } catch (error) {
            throw error;
        }
    },

    bulkDeleteUsers: async (userIds) => {
        try {
            const response = await fetch(`${API_URL}/users/bulk-delete`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify({ userIds }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to delete users');
            return data;
        } catch (error) {
            throw error;
        }
    }
};
