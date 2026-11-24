import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getHealth = () => api.get('/health');

export const ingestTelemetry = (telemetry) =>
    api.post('/telemetry', telemetry);

export const getTelemetry = ({ deviceId, limit = 50, signal } = {}) =>
    api.get('/telemetry', {
        params: { deviceId, limit },
        signal,
    });

export default api;