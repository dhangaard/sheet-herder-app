import { BASE_URL, throwIfError } from './apiClient';
import { buildOptions } from './authService'


export async function getCharacters() {
    const response = await fetch(BASE_URL + `character-sheets`, buildOptions('GET', true));
    await throwIfError(response, 'Could not load character sheets');
    return response.json();
}
