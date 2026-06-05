import { BASE_URL, throwIfError } from './apiClient';
import { buildOptions } from './authService'

export async function getCharacters() {
    const response = await fetch(BASE_URL + `character-sheets`, buildOptions('GET', true));
    await throwIfError(response, 'Could not load character sheets');
    return response.json();
}

export async function getCharacter(id) {
    const response = await fetch(BASE_URL + `character-sheets/${id}`, buildOptions('GET', true));
    await throwIfError(response, `Could not load character sheet | id: ${id}`);
    return response.json();
}

export async function deleteCharacter(id) {
    const response = await fetch(BASE_URL + `character-sheets/${id}`, buildOptions('DELETE', true));
    await throwIfError(response, `Could not delete character sheet | id: ${id}`);
}