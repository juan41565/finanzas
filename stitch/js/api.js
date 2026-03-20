const BASE_URL = 'https://finanzas-api.ubunifusoft.digital';

window.api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.mensaje || 'Error en la petición');
        }

        return result;
    },

    auth: {
        login: (credentials) => window.api.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
        register: (userData) => window.api.request('/api/auth/registro', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),
        me: () => window.api.request('/api/auth/me'),
    },

    workspaces: {
        list: (usuarioId) => window.api.request(`/api/workspaces?usuarioId=${usuarioId}`),
        select: (id) => window.api.request(`/api/workspaces/${id}/seleccionar`, {
            method: 'POST',
        }),
    },

    categories: {
        list: (workspaceId) => window.api.request(`/api/categorias?workspaceId=${workspaceId}`),
        create: (category) => window.api.request('/api/categorias', {
            method: 'POST',
            body: JSON.stringify(category),
        }),
        update: (id, category) => window.api.request(`/api/categorias/${id}`, {
            method: 'PUT',
            body: JSON.stringify(category),
        }),
        delete: (id) => window.api.request(`/api/categorias/${id}`, {
            method: 'DELETE',
        }),
    },

    transactions: {
        list: (workspaceId) => window.api.request(`/api/transactions?workspaceId=${workspaceId}`),
        create: (transaction) => window.api.request('/api/transactions', {
            method: 'POST',
            body: JSON.stringify(transaction),
        }),
        delete: (id) => window.api.request(`/api/transactions/${id}`, {
            method: 'DELETE',
        }),
    },

    dashboard: {
        getMonthlySummary: (workspaceId, anio, mes) => 
            window.api.request(`/api/dashboard/resumen-mensual?workspaceId=${workspaceId}&anio=${anio}&mes=${mes}`),
        getYearlyCashFlow: (workspaceId, anio) => 
            window.api.request(`/api/dashboard/flujo-caja?workspaceId=${workspaceId}&anio=${anio}`),
    },

    beneficiaries: {
        list: (workspaceId) => window.api.request(`/api/beneficiarios?workspaceId=${workspaceId}`),
        create: (beneficiary) => window.api.request('/api/beneficiarios', {
            method: 'POST',
            body: JSON.stringify(beneficiary),
        }),
    }
};
