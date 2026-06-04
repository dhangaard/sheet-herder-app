import styles from './CampaignOverviewGuest.module.css'
import OverviewPanel from '../../../components/overviewPanel/OverviewPanel.jsx'

export default function CampaignOverviewGuest() {
    return (
        <div className={styles.page}>
            <OverviewPanel
                heading="Herd Your Players, Shape Your Story"
                description="Every great story needs a great storyteller. Gather your party, track your characters, and keep your campaign alive from the first session to the last."
                ctaLabel="Start A Campaign →"
                ctaTo="/login"
            />
        </div>
    )
}