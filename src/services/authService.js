import { BASE_URL, throwIfError } from "./apiClient";

const MS_PER_SECOND = 1000;

export async function register(credentials) {
    const response = await fetch(BASE_URL + 'auth/register', buildOptions('POST', false, credentials));
    await throwIfError(response, 'Registration failed');
}

export async function login(credentials) {
    const response = await fetch(BASE_URL + 'auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    await throwIfError(response, 'Could not login')
    const { token } = await response.json();
    localStorage.setItem('token', token);
    return token;
}

export function logout() {
    localStorage.removeItem('token');
}

export function getToken() {
    return localStorage.getItem('token');
}

export function loggedIn() {
    return getToken() != null && !isTokenExpired();
}

export function isTokenExpired() {
    const token = getToken();
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * MS_PER_SECOND < Date.now();
    } catch {
        // Malformed or tampered token — treat as expired
        return true;
    }
}

export async function verifyPassword(email, password) {
    const response = await fetch(BASE_URL + 'auth/login', buildOptions('POST', false, { email, password }));
    return response.ok;
}

export function buildOptions(method, addToken, body) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (addToken && loggedIn()) {
        options.headers['Authorization'] = `Bearer ${getToken()}`;
    }
    if (body) {
        options.body = JSON.stringify(body);
    }
    return options;
}