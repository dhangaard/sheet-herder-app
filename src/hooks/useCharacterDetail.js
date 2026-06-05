import { useState, useEffect } from 'react'
import { getCharacter } from '../services/characterService.js'
import { createPlaceholderData } from '../utils/characterUtil.js';

export function useCharacterDetail(id) {
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        async function fetchCharacter() {
            try {
                const data = await getCharacter(id);
                data.placeholder = createPlaceholderData();
                setCharacter(data);
            } catch (error) {
                setStatus({ type: 'error', message: error.message });
            } finally {
                setLoading(false);
            }
        }
        fetchCharacter();
    }, [id]);

    return { character, setCharacter, loading, status };
}