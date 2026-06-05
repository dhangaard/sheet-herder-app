import styles from './CharacterOverviewGuest.module.css'
import OverviewPanel from '../../../components/overviewPanel/OverviewPanel.jsx'

export default function CharacterOverviewGuest() {
    return (
        <div className={styles.page}>
            <OverviewPanel
                heading="Herd Your Characters, Own Your Story"
                description="Build your roster, track your adventures, and keep every character ready for their next session."
                ctaLabel="Create a Character →"
                ctaTo="/login"
                reverse={true}
            />
        </div>
    );
}