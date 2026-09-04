# Project Apex — Architecture Blueprint

An immersive, multi-platform streaming experience layered on top of the existing
**RaY-Movies** Next.js app. The core streaming APIs and source routing are
**untouched** — Apex is a presentation + architecture layer around them.

## 1. Technology Stack
- **Next.js 14 (App Router)** + **React 18** + **TypeScript**
- **Tailwind CSS** for fluid, responsive layout (OLED-black + neon token set)
- **Framer Motion** for spring physics, tilt, and cinematic transitions
- **Canvas 2D** for the zero-asset particle splash (safe on PWA / TV runtimes)

## 2. Folder Structure (atomic + multi-platform ready)

```
app/                      # App Router routes + route handlers
  api/
    stream/route.ts       # ⛔ STREAM ROUTING — untouched, source of truth
    media/[id]/route.ts   # media detail proxy (keys stay server-side)
    search/route.ts       # search proxy
  media/[id]/page.tsx     # detail + <StreamingPlayer/> (untouched playback)
  components/             # route-scoped presentational components

components/
  apex/                   # ✨ Project Apex atomic UI system
    ApexIntro.tsx         #   cinematic splash / portal reveal
    SpatialDock.tsx       #   floating spring-physics nav dock (D-pad ready)
    TiltCard.tsx          #   reusable 3D pointer-tilt wrapper
    index.ts              #   barrel export

services/                 # 🔌 decoupled API/domain layer (platform-agnostic)
  apiClient.ts            #   transport wrapper (swap for RN/Capacitor/TV)
  mediaService.ts         #   domain methods; references existing /api contracts

hooks/                    # reusable behavior
  useMedia.ts             #   async-resource hook template (SWR-swappable)
  useSpatialNavigation.ts #   arrow/D-pad focus traversal for Smart TV
```

### Why this shape scales to PWA / Mobile / TV
- **UI never calls `fetch` directly** — it goes through `services/` + `hooks/`.
  To ship a **React Native / Capacitor** wrapper, re-implement only
  `apiClient.ts`; every component keeps working.
- **`public/manifest.json` + `sw.js`** already make this installable as a **PWA**.
- **`useSpatialNavigation`** + `[data-apex-nav]` + `.apex-focusable` give
  **Smart-TV (Tizen/webOS)** D-pad traversal with visible neon focus, with no
  change to layout code.

## 3. The Apex Welcome (Entry / Splash)
`components/apex/ApexIntro.tsx`
- Dark spatial particle field, gravitationally pulled into a glowing portal that
  resolves into the wordmark, then fades into the dashboard **without layout shift**.
- **Skip Intro** for returning users; state persisted in `localStorage`
  (`apex_intro_seen_v1`). Honours `prefers-reduced-motion`.

## 4. Visuals, Motion & Layout
- **Cards:** `TiltCard` gives 3D tilt, a moving specular glow, and neon borders.
- **Navigation:** `SpatialDock` — translucent glass, auto-collapses to a rail,
  expands with spring physics; vertical on desktop, thumb-reachable on mobile.
- **Theme:** true OLED blacks (`apex.void`/`apex.abyss`) + neon accents
  (cyan / violet / magenta). Skeleton shimmer via `.apex-skeleton`.

## 5. Device Responsiveness & TV
- Fluid Tailwind grid/flex across touch, mouse/keyboard, and D-pad.
- Global keyboard listeners (arrows / Enter / Back) via `useSpatialNavigation`.

---

### Streaming integrity guarantee
`app/api/stream/route.ts`, `StreamingPlayer`, `StreamSelector`, and the
`VideoEmbed` components — the entire playback + source-routing path — are
**not modified** by Project Apex.
