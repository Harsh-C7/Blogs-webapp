
export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('token');
    return !!token;
};

export const getCurrentUser = () => {
    if (typeof window === 'undefined') return null;

    const userData = localStorage.getItem('user');
    if (!userData) return null;

    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

export const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

export const logout = () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const setAuthData = (token, user) => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

export const authenticatedFetch = async (url, options = {}) => {
    const token = getToken();

    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
    };

    return fetch(url, {
        ...options,
        headers,
    });
  };