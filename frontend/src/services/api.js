import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
};

export const transactionService = {
    getAll: (page = 0, size = 10) => api.get(`/transactions?page=${page}&size=${size}`),
    create: (data) => api.post('/transactions', data),
    update: (id, data) => api.put(`/transactions/${id}`, data),
    delete: (id) => api.delete(`/transactions/${id}`),
};

export const categoryService = {
    getAll: () => api.get('/categories'),
    create: (data) => api.post('/categories', data),
    delete: (id) => api.delete(`/categories/${id}`),
};

export const dashboardService = {
    getStats: () => api.get('/dashboard/stats'),
    getExpenseByCategory: () => api.get('/dashboard/expense-by-category'),
    getMonthlyAnalysis: () => api.get('/dashboard/monthly-analysis'),
};

export const userSettingsService = {
    get: () => api.get('/settings'),
    update: (data) => api.put('/settings', data),
};

export default api;
