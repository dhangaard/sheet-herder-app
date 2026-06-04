import { useAuth } from '../../../context/auth/useAuth.js'
import CampaignOverviewGuest from './CampaignOverviewGuest.jsx'
import CampaignOverviewLoggedIn from './CampaignOverviewLoggedIn.jsx'

export default function CampaignOverview() {
    const { isLoggedIn } = useAuth()
    return isLoggedIn ? <CampaignOverviewLoggedIn /> : <CampaignOverviewGuest />
}