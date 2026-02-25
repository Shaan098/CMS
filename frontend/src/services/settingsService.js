import api from './api';

// Get all settings (Admin only)
export const getSettings = async () => {
    const response = await api.get('/settings');
    return response.data;
};

// Update or create setting (Admin only)
export const updateSetting = async (settingData) => {
    const response = await api.put('/settings', settingData);
    return response.data;
};

// Delete setting (Admin only)
export const deleteSetting = async (key) => {
    const response = await api.delete(`/settings/${key}`);
    return response.data;
};
