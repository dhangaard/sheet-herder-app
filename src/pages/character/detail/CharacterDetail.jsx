import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { updateCharacter } from '../../../services/characterService.js'
import { useCharacterDetail } from '../../../hooks/useCharacterDetail.js'
import { createPlaceholderData } from '../../../utils/characterUtil.js'
import Button from '../../../components/button/Button.jsx'
import StatusMessage from '../../../components/statusMessage/StatusMessage.jsx'
import styles from './CharacterDetail.module.css'

function AbilityScore({ label, value }) {
    return (
        <div className={styles.abilityScore}>
            <span className={styles.abilityLabel}>{label}</span>
            <span className={styles.abilityValue}>{value}</span>
        </div>
    );
}

function AbilityScoreBox({ abilityScores }) {
    return (
        <section className={styles.abilityScoreBox}>
            {Object.entries(abilityScores).map(([ability, value]) => (
                <AbilityScore
                    key={ability}
                    label={ability}
                    value={value}
                />
            ))}
        </section>
    );
}

function CharacterHeader({ name, race, placeholder }) {
    const { level, className } = placeholder;

    return (
        <div className={styles.characterHeader}>
            <div className={styles.characterHeaderName}>
                <span className={styles.characterHeaderLabel}>Character Name</span>
                <span className={styles.characterHeaderValue}>{name}</span>
            </div>
            <div className={styles.characterHeaderMeta}>
                <div className={styles.characterHeaderField}>
                    <span className={styles.characterHeaderLabel}>Race</span>
                    <span className={styles.characterHeaderValue}>{race}</span>
                </div>
                <div className={styles.characterHeaderField}>
                    <span className={styles.characterHeaderLabel}>Class</span>
                    <span className={styles.characterHeaderValue}>{className}</span>
                </div>
                <div className={styles.characterHeaderField}>
                    <span className={styles.characterHeaderLabel}>Level</span>
                    <span className={styles.characterHeaderValue}>{level}</span>
                </div>
            </div>
        </div>
    );
}

function NoteLog({ notes, characterId, onUpdate }) {
    const [input, setInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);
    const [confirmingKey, setConfirmingKey] = useState(null);

    const sortedEntries = Object.entries(notes).sort((a, b) => b[0].localeCompare(a[0]));

    async function handleSave() {
        if (!input.trim()) {
            return;
        }
        setSaving(true);
        try {
            const key = new Date().toISOString();
            const updatedNotes = { ...notes, [key]: input.trim() };
            const updated = await updateCharacter(characterId, { notes: updatedNotes });
            updated.placeholder = createPlaceholderData();
            onUpdate(updated);
            setInput('');
            setStatus(null);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(key) {
        const remainingNotes = Object.fromEntries(
            Object.entries(notes).filter(([entryKey]) => entryKey !== key)
        );
        try {
            const updated = await updateCharacter(characterId, { notes: remainingNotes });
            updated.placeholder = createPlaceholderData();
            onUpdate(updated);
            setConfirmingKey(null);
            setStatus(null);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    }

    return (
        <section className={styles.noteLog}>
            <h3 className={styles.sectionTitle}>Notes</h3>
            {status && <StatusMessage status={status} />}
            <div className={styles.noteInput}>
                <textarea
                    className={styles.noteTextarea}
                    value={input}
                    onChange={event => setInput(event.target.value)}
                    placeholder="Write a note..."
                    rows={3}
                />
                <Button onClick={handleSave} disabled={saving || !input.trim()}>
                    Save note
                </Button>
            </div>
            <div className={styles.noteEntries}>
                {sortedEntries.length === 0 ? (
                    <p className={styles.empty}>No notes yet.</p>
                ) : (
                    sortedEntries.map(([timestamp, text]) => (
                        <div key={timestamp} className={styles.noteEntry}>
                            <div className={styles.noteEntryHeader}>
                                <span className={styles.noteTimestamp}>
                                    {new Date(timestamp).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                                {confirmingKey === timestamp ? (
                                    <div className={styles.noteDeleteConfirm}>
                                        <span className={styles.noteDeletePrompt}>
                                            Are you sure?
                                        </span>
                                        <Button variant="danger" onClick={() => handleDelete(timestamp)}>
                                            Delete
                                        </Button>
                                        <Button variant="secondary" onClick={() => setConfirmingKey(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="secondary" onClick={() => setConfirmingKey(timestamp)}>
                                        Delete
                                    </Button>
                                )}
                            </div>
                            <p className={styles.noteText}>{text}</p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default function CharacterDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const headingRef = useRef(null);
    const { character, setCharacter, loading, status } = useCharacterDetail(id);

    useEffect(() => {
        if (character && headingRef.current) {
            headingRef.current.focus();
        }
    }, [character]);

    if (loading) {
        return <p className={styles.loading}>Loading...</p>;
    }

    if (status) {
        return (
            <div className={styles.page}>
                <StatusMessage status={status} />
            </div>
        );
    }

    const race = character.subraceName ?? character.raceName;

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <Button variant="secondary" onClick={() => navigate('/characters')}>← Back</Button>
                <Button onClick={() => navigate(`/characters/${id}/edit`)}>Edit character</Button>
            </div>
            <h2 ref={headingRef} tabIndex={-1} className={styles.heading}>
                {character.name}
            </h2>
            <CharacterHeader
                name={character.name}
                race={race}
                placeholder={character.placeholder}
            />
            <AbilityScoreBox abilityScores={character.abilityScores} />
            <NoteLog
                notes={character.notes}
                characterId={character.id}
                onUpdate={setCharacter}
            />
        </div>
    );
}