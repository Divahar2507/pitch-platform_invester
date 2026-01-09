
const API_URL = 'http://127.0.0.1:8000';

export const api = {
    login: async (email, password) => {
        const formData = new URLSearchParams();
        // The backend uses a specific schema UserLogin which expects JSON body, NOT OAuth2 PasswordRequestForm.
        // Wait, let's double check auth.py.
        // @router.post("/login", response_model=Token)
        // def login(user_credentials: UserLogin, ...)
        // UserLogin is a pydantic model, so it expects JSON.

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    },

    register: async (email, password, role) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
        }

        return response.json();
    },

    getMe: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch user profile');
        return response.json();
    },

    getPitchFeed: async (industry = 'All', stage = 'All') => {
        let url = `${API_URL}/pitches/feed?skip=0&limit=50`;
        if (industry && industry !== 'All') url += `&industry=${encodeURIComponent(industry)}`;
        if (stage && stage !== 'All') url += `&stage=${encodeURIComponent(stage)}`;

        // Note: getPitchFeed uses Optional auth, so headers are optional but good to send if we have them.
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error('Failed to fetch pitch feed');
        return response.json();
    },

    getInvestments: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/investments/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch investments');
        return response.json();
    }
};
