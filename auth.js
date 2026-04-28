// ── Auth System (localStorage-based) ──

const Auth = {
    STORAGE_KEY: 'app_users',
    SESSION_KEY: 'app_session',

    getUsers() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    },

    saveUsers(users) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    },

    register({ firstName, lastName, email, password, role }) {
        const users = this.getUsers();
        if (users.find(u => u.email === email)) {
            return { ok: false, error: 'An account with this email already exists.' };
        }
        const user = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            password, // plain-text for demo; hash in production
            role,     // 'admin' | 'user'
            createdAt: new Date().toISOString()
        };
        users.push(user);
        this.saveUsers(users);
        return { ok: true, user };
    },

    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) return { ok: false, error: 'Incorrect email or password.' };
        const session = {
            userId: user.id,
            role: user.role,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        return { ok: true, session };
    },

    getSession() {
        return JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null');
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'login.html';
    },

    requireAuth(allowedRoles) {
        const session = this.getSession();
        if (!session) { window.location.href = 'login.html'; return null; }
        if (allowedRoles && !allowedRoles.includes(session.role)) {
            window.location.href = 'login.html'; return null;
        }
        return session;
    },

    dashboardFor(role) {
        const map = { admin: 'dashboard-admin.html', user: 'dashboard-user.html' };
        return map[role] || 'login.html';
    }
};