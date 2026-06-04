import { useMemo } from 'react'
import styles from './CharacterCard.module.css'
import ProfilePicturePlaceholder from '../profilePicturePlaceholder/ProfilePicturePlaceholder.jsx'

const CLASSES = [
    'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter',
    'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer',
    'Warlock', 'Wizard'
];

const MAX_LEVEL = 5;
const MIN_LEVEL = 1;

export default function CharacterCard({ character }) {
    const placeholder = useMemo(() => ({
        level: Math.floor(Math.random() * MAX_LEVEL) + MIN_LEVEL,
        className: CLASSES[Math.floor(Math.random() * CLASSES.length)]
    }), []);

    const race = character.subraceName ?? character.raceName;

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
                <button className={styles.action}>View</button>
                <button className={styles.action}>Edit</button>
                <button className={`${styles.action} ${styles.danger}`}>Delete</button>
            </div>
        </div>
    );
}