window.auth = {
    async login(email, password) {
        try {
            const response = await window.api.auth.login({ email, password });
            if (response.status === 200 && response.data) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    email: response.data.email,
                    nombre: response.data.nombre
                }));
                
                if (response.data.workspaces && response.data.workspaces.length > 0) {
                    const workspace = response.data.workspaces[0];
                    localStorage.setItem('workspaceId', workspace.id);
                    localStorage.setItem('workspaceName', workspace.nombre);
                    await window.api.workspaces.select(workspace.id);
                }
                return response.data;
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout() {
        localStorage.clear();
        window.location.href = 'login.html';
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    async checkSession() {
        if (!this.isAuthenticated()) {
            if (!window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
                window.location.href = 'login.html';
            }
            return false;
        }
        return true;
    }
};
