import api from './api';

// Get all CMS content
export const getAllCMS = async () => {
    const response = await api.get('/cms');
    return response.data;
};

// Get single CMS content by ID
export const getCMSById = async (id) => {
    const response = await api.get(`/cms/${id}`);
    return response.data;
};

// Create new CMS content (Admin only)
export const createCMS = async (cmsData) => {
    const response = await api.post('/cms', cmsData);
    return response.data;
};

// Update CMS content (Admin only)
export const updateCMS = async (id, cmsData) => {
    const response = await api.put(`/cms/${id}`, cmsData);
    return response.data;
};

// Delete CMS content (Admin only)
export const deleteCMS = async (id) => {
    const response = await api.delete(`/cms/${id}`);
    return response.data;
};

// Get pending CMS content (Admin only)
export const getPendingCMS = async () => {
    const response = await api.get('/cms/pending');
    return response.data;
};

// Get user's own submissions
export const getMySubmissions = async () => {
    const response = await api.get('/cms/my-submissions');
    return response.data;
};

// Approve CMS content (Admin only)
export const approveCMS = async (id) => {
    const response = await api.put(`/cms/${id}/approve`);
    return response.data;
};

// Reject CMS content (Admin only)
export const rejectCMS = async (id, reason) => {
    const response = await api.put(`/cms/${id}/reject`, { reason });
    return response.data;
};

// Get pending count (Admin only)
export const getPendingCount = async () => {
    const response = await api.get('/cms/pending/count');
    return response.data;
};
