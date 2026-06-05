import { Route, Routes } from 'react-router'
import App from '../App.jsx'

import Account from '../pages/user/account/Account.jsx'
import CampaignOverview from '../pages/campaign/overview/CampaignOverview.jsx'
import CharacterCreate from '../pages/character/create/CharacterCreate.jsx'
import CharacterDetail from '../pages/character/detail/CharacterDetail.jsx'
import CharacterEdit from '../pages/character/edit/CharacterEdit.jsx'
import CharacterOverview from '../pages/character/overview/CharacterOverview.jsx'
import Homepage from '../pages/homepage/Homepage.jsx'
import Login from '../pages/user/login/Login.jsx'
import NotFound from '../pages/notFound/NotFound.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Register from '../pages/user/register/Register.jsx'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Homepage />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="campaigns" element={<CampaignOverview />} />
                <Route path="characters" element={<CharacterOverview />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="account" element={<Account />} />
                    <Route path="characters">
                        <Route path="create" element={<CharacterCreate />} />
                        <Route path=":id" element={<CharacterDetail />} />
                        <Route path=":id/edit" element={<CharacterEdit />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}