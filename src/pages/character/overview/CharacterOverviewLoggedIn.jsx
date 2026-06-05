import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getCharacters } from '../../../services/characterService.js'
import CharacterCard from '../../../components/characterCard/CharacterCard.jsx'
import StatusMessage from '../../../components/statusMessage/StatusMessage.jsx'
import Button from '../../../components/button/Button.jsx'
import styles from './CharacterOverviewLoggedIn.module.css'

export default function CharacterOverviewLoggedIn() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCharacters() {
            try {
                const data = await getCharacters();
                setCharacters(data);
            } catch (error) {
                setStatus({ type: 'error', message: error.message });
            } finally {
                setLoading(false);
            }
        }

        fetchCharacters();
    }, []);

    function handleDelete(id) {
        setCharacters(previous => previous.filter(character => character.id !== id));
        setDeletingId(null);
    }

    if (loading) {
        return (
            <div className={styles.page}>
                <p>Loading characters…</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <div className={styles.titleGroup}>
                    <h2>My Character Sheets</h2>
                    <span className={styles.count}>{characters.length} {characters.length === 1 ? 'character' : 'characters'}</span>
                </div>
                <Button onClick={() => { navigate('/characters/create'); }}>Create a Character</Button>
            </div>
            <StatusMessage status={status} />
            {characters.length === 0 ? (
                <div className={styles.empty}>
                    <p>Your herd is empty... Create your first character to get started.</p>
                    <Button onClick={() => { navigate('/characters/create'); }}>Create a Character</Button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {characters.map(character => (
                        <CharacterCard
                            key={character.id}
                            character={character}
                            onDelete={handleDelete}
                            onStatus={setStatus}
                            confirmingDelete={deletingId === character.id}
                            onOpenDelete={() => { setStatus(null); setDeletingId(character.id); }}
                            onCancelDelete={() => setDeletingId(null)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}