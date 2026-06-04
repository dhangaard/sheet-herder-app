import { buildOptions } from './authService'

const BASE_URL = 'https://sheet-herder-api.dhangaard.dk/api/v1/';

const throwIfError = async (response, fallbackMessage) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || fallbackMessage);
    }
}

export async function register(credentials) {
    const response = await fetch(BASE_URL + 'auth/register', buildOptions('POST', false, credentials));
    await throwIfError(response, 'Registration failed');
}

export async function getCurrentUser(id) {
    const response = await fetch(BASE_URL + `users/${id}`, buildOptions('GET', true));
    await throwIfError(response, 'Could not load account');
    return response.json();
}

export async function updateUser(id, changes) {
    const response = await fetch(BASE_URL + `users/${id}`, buildOptions('PUT', true, changes));
    await throwIfError(response, 'Could not update account');
    return response.json();
}

export async function deleteUser(id) {
    const response = await fetch(BASE_URL + `users/${id}`, buildOptions('DELETE', true));
    await throwIfError(response, 'Could not delete account');
}