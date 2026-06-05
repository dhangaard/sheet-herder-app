# Sheet Herder

Sheet Herder is a TTRPG companion app for managing D&D characters and campaigns. This repository is the React frontend — a prototype built to explore and demonstrate the frontend technologies taught in the 3rd semester of the Datamatiker programme at Erhvervsakademi København. The focus is on learning and applied use of technology, not on a finished product.

[Video demo](https://youtu.be/fA4ZswHFNVg) · [Live app](https://sheet-herder.dhangaard.dk) · [Portfolio](https://dhangaard.dk) · [Backend API](https://sheet-herder-api.dhangaard.dk/api/v1/) · [Backend Repository](https://github.com/dhangaard/sheet-herder-api)

---

## Features

- Register and log in with JWT authentication
- View characters with ability scores, race, and languages sourced from the D&D 5e API
- Append and delete timestamped notes on individual characters
- Dark mode with system preference detection
- Distinct guest and logged-in views throughout

---

## Tech stack

| | |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| Styling | CSS Modules + CSS custom properties |
| Auth | JWT stored in `localStorage` |
| HTTP | Native `fetch` via shared `apiClient.js` |
| Icons | `vite-plugin-svgr` (SVG as React components) |

---

## Architecture

Pages orchestrate data and state, components are reusable and receive props only, and services own all HTTP communication. Auth state is split across two React Context objects — `AuthContext` for reading state and `AuthActionsContext` for triggering mutations — so components that only need to read do not re-render on action changes.

```
src/
├── components/     # Reusable UI components
├── context/        # Auth context (split into authContext, AuthProvider, useAuth)
├── hooks/          # Custom hooks
├── pages/
│   ├── homepage/   # HomepageGuest / HomepageLoggedIn
│   ├── character/  # CharacterOverviewGuest / CharacterOverviewLoggedIn / CharacterDetail
│   ├── campaign/   # CampaignOverviewGuest / CampaignOverviewLoggedIn
│   └── user/       # Login / Register / Account
├── services/       # HTTP clients — one file per resource
├── styles/         # Global CSS (reset, variables, typography, layout)
└── utils/          # Pure helper functions
```

---

## Component tree

```mermaid
flowchart TD
  main["main.jsx<br/>(React root / providers)"] --> Router["BrowserRouter<br/>(react-router)"]
  Router --> AuthProvider["AuthProvider<br/>(auth context)"]
  AuthProvider --> AppRoutes["AppRoutes.jsx<br/>(route definitions)"]

  AppRoutes --> App["App.jsx<br/>(layout shell + theme)"]
  App --> Header["Header.jsx<br/>(nav + auth actions + theme toggle)"]
  App --> Outlet["&lt;Outlet /&gt;<br/>(current route content)"]
  App --> Footer["Footer.jsx<br/>(footer layout)"]

  Outlet --> Homepage["Homepage.jsx<br/>(decides guest vs logged-in home)"]
  Outlet --> Login["Login.jsx<br/>(sign in form)"]
  Outlet --> Register["Register.jsx<br/>(create user form)"]
  Outlet --> CampaignOverview["CampaignOverview.jsx<br/>(campaign landing / overview)"]
  Outlet --> CharacterOverview["CharacterOverview.jsx<br/>(character landing / overview)"]
  Outlet --> ProtectedRoute["ProtectedRoute.jsx<br/>(guards auth-only pages)"]
  Outlet --> NotFound["NotFound.jsx<br/>(404 page)"]

  Homepage --> HomepageGuest["HomepageGuest.jsx<br/>(marketing + feature tabs)"]
  Homepage --> HomepageLoggedIn["HomepageLoggedIn.jsx<br/>(quick links dashboard)"]

  CampaignOverview --> CampaignOverviewGuest["CampaignOverviewGuest.jsx<br/>(CTA to login)"]
  CampaignOverview --> CampaignOverviewLoggedIn["CampaignOverviewLoggedIn.jsx<br/>(currently placeholder)"]

  CharacterOverview --> CharacterOverviewGuest["CharacterOverviewGuest.jsx<br/>(CTA to login)"]
  CharacterOverview --> CharacterOverviewLoggedIn["CharacterOverviewLoggedIn.jsx<br/>(list/manage characters)"]

  ProtectedRoute --> Account["Account.jsx<br/>(view/update/delete account)"]
  ProtectedRoute --> CharacterCreate["CharacterCreate.jsx<br/>(currently placeholder)"]
  ProtectedRoute --> CharacterDetail["CharacterDetail.jsx<br/>(view single character)"]
  ProtectedRoute --> CharacterEdit["CharacterEdit.jsx<br/>(currently placeholder)"]

  CharacterDetail --> CharacterHeader["CharacterHeader<br/>(file-local component)"]
  CharacterDetail --> AbilityScoreBox["AbilityScoreBox<br/>(file-local component)"]
  CharacterDetail --> NoteLog["NoteLog<br/>(file-local component)"]
  AbilityScoreBox --> AbilityScore["AbilityScore<br/>(file-local component)"]

  HomepageGuest --> FeaturePanel["FeaturePanel.jsx<br/>(tabbed feature section)"]
  HomepageLoggedIn --> FeatureCard["FeatureCard.jsx<br/>(link card)"]
  FeaturePanel --> TabSwitcher["TabSwitcher.jsx<br/>(tab switcher UI)"]

  Login --> FormCard["FormCard.jsx<br/>(form layout wrapper)"]
  Register --> FormCard
  Account --> FormCard
  FormCard --> Field["Field.jsx<br/>(input + label + validation)"]
  FormCard --> Button["Button.jsx<br/>(primary/secondary/danger)"]
  FormCard --> StatusMessage["StatusMessage.jsx<br/>(success/error feedback)"]

  HomepageGuest --> StatusMessage
  Account --> StatusMessage

  CampaignOverviewGuest --> OverviewPanel["OverviewPanel.jsx<br/>(hero + CTA panel)"]
  CharacterOverviewGuest --> OverviewPanel
  OverviewPanel --> Button
  OverviewPanel --> ImagePlaceholder["ImagePlaceholder.jsx<br/>(illustration placeholder)"]

  CampaignOverviewLoggedIn --> UnderConstruction["UnderConstruction.jsx<br/>(placeholder page)"]
  CharacterCreate --> UnderConstruction
  CharacterEdit --> UnderConstruction

  CharacterOverviewLoggedIn --> CharacterCard["CharacterCard.jsx<br/>(character summary card)"]
  CharacterCard --> ProfilePicturePlaceholder["ProfilePicturePlaceholder.jsx<br/>(avatar placeholder)"]

  Header --> Toggle["Toggle.jsx<br/>(theme switch UI)"]
```

---

## Deployment

The app is built as static files via `vite build` and served by Caddy on a DigitalOcean droplet. Deployments trigger automatically on push to `main` via GitHub Actions.

---

## Contributors

**Daniel Hangaard**  
cph-dh258@stud.ek.dk  
[github.com/DHangaard](https://github.com/DHangaard)

---

## License

The source code in this repository is licensed under the MIT License.
See the [LICENSE](./LICENSE) file for details.

**Note:** The project name, logo, and visual identity are **not** included under the MIT License.
Please refer to [BRANDING.md](./BRANDING.md) for usage guidelines and copyright information regarding these assets.
