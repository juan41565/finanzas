window.utils = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    },

    formatDate: (dateString, options = {}) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CO', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            ...options
        }).format(date);
    },

    showError: (message) => {
        alert("Error: " + message);
    }
};
