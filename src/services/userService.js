import { BASE_URL, throwIfError } from './apiClient';
import { buildOptions } from './authService'

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