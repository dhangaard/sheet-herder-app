export const CLASSES = [
    'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter',
    'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer',
    'Warlock', 'Wizard'
];

export const MAX_LEVEL = 5;
export const MIN_LEVEL = 1;

export function createPlaceholderData() {
    return {
        level: Math.floor(Math.random() * MAX_LEVEL) + MIN_LEVEL,
        className: CLASSES[Math.floor(Math.random() * CLASSES.length)]
    };
}