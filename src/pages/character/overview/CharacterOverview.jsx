import { useAuth } from '../../../context/auth/useAuth.js'
import CharacterOverviewGuest from './CharacterOverviewGuest.jsx'
import CharacterOverviewLoggedIn from './CharacterOverviewLoggedIn.jsx'

export default function CharacterOverview() {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <CharacterOverviewLoggedIn /> : <CharacterOverviewGuest />;
}