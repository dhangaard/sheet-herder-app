export const BASE_URL = 'https://sheet-herder-api.dhangaard.dk/api/v1/';

export async function throwIfError(response, fallbackMessage) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || fallbackMessage);
    }
}