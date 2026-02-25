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
