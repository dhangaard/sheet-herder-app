import { useState } from 'react'
import { useNavigate } from 'react-router'
import { deleteCharacter } from '../../services/characterService.js'
import styles from './CharacterCard.module.css'
import ProfilePicturePlaceholder from '../profilePicturePlaceholder/ProfilePicturePlaceholder.jsx'
import Field from '../field/Field.jsx'
import Button from '../button/Button.jsx'

const CLASSES = [
    'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter',
    'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer',
    'Warlock', 'Wizard'
];

const MAX_LEVEL = 5;
const MIN_LEVEL = 1;

export default function CharacterCard({ character, onDelete, onStatus, confirmingDelete, onOpenDelete, onCancelDelete }) {
    const navigate = useNavigate();

    const [placeholder] = useState(createPlaceholder);
    const [deleteInput, setDeleteInput] = useState('');
    const [deleting, setDeleting] = useState(false);

    const race = character.subraceName ?? character.raceName;
    const canConfirmDelete = deleteInput === character.name;

    function createPlaceholder() {
        return {
            level: Math.floor(Math.random() * MAX_LEVEL) + MIN_LEVEL,
            className: CLASSES[Math.floor(Math.random() * CLASSES.length)]
        };
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteCharacter(character.id);
            onDelete(character.id);
            onStatus({ type: 'success', message: 'Character deleted' });
        } catch (error) {
            onStatus({ type: 'error', message: error.message });
            onCancelDelete();
            setDeleteInput('');
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.portrait}>
                    <ProfilePicturePlaceholder />
                </div>
                <div className={styles.info}>
                    <h3 className={styles.name}>{character.name}</h3>
                    <p className={styles.sub}>Level {placeholder.level} | {race} | {placeholder.className}</p>
                </div>
            </div>
            <div className={styles.actions}>
                <button className={styles.action} onClick={() => navigate(`/characters/${character.id}`)}>View</button>
                <button className={styles.action} onClick={() => navigate(`/characters/${character.id}/edit`)}>Edit</button>
                <button className={`${styles.action} ${styles.danger}`} onClick={onOpenDelete}>Delete</button>
            </div>
            <div className={`${styles.confirmWrapper} ${confirmingDelete ? styles.open : ''}`}>
                <div className={styles.confirmInner}>
                    <p className={styles.confirmText}>Type <strong>"{character.name}"</strong> to confirm deletion.</p>
                    <Field
                        label="Character name"
                        id={`delete-confirm-${character.id}`}
                        value={deleteInput}
                        onChange={event => setDeleteInput(event.target.value)}
                    />
                    <div className={styles.confirmButtons}>
                        <Button variant="danger" onClick={handleDelete} disabled={deleting || !canConfirmDelete}>
                            Delete permanently
                        </Button>
                        <Button variant="secondary" onClick={onCancelDelete}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}