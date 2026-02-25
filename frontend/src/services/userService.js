import api from './api';

// Get all users (Admin only)
export const getAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

// Update user role (Admin only)
export const updateUserRole = async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
};

// Delete user (Admin only)
export const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};
