import api from './api';

// Get system reports (Admin only)
export const getReports = async () => {
    const response = await api.get('/reports');
    return response.data;
};

// Get report history (Admin only)
export const getReportHistory = async () => {
    const response = await api.get('/reports/history');
    return response.data;
};
