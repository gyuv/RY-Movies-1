# Cinereel

A search-first movie & TV discovery app. Search by title, actor, actress, or
director; filter by genre, year, language, and type; see every **legal**
place to watch — subscription, free-with-ads, rent, or buy — with an
embedded official trailer player.

## Scope, deliberately

This app aggregates **licensed availability data only** (TMDb's
`watch/providers` endpoint, backed by JustWatch). It does not scrape, embed,
or index unlicensed "free streaming" sites — that's both a legal problem
(copyright infringement) and a security one for users (malicious embeds,
popups, fake players). The "Free" badge you see in the UI means *legally
free*: ad-supported services like Tubi or Pluto that TMDb's data marks as
`free`/`ads`, not pirated copies.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**, custom design tokens (no default shadcn/Tailwind starter look)
- **TMDb API** for metadata, cast, trailers, and watch providers
- Zero external UI kit — every component is hand-built for this design

## Getting started

```bash
npm install
cp .env.example .env.local
# add your TMDb key to .env.local
npm run dev
```

**No API key yet?** The app runs immediately with realistic mock data
(`lib/tmdb.ts` falls back automatically) so you can browse the full UI
before wiring up TMDb.

## Folder structure

```
app/
  layout.tsx              root shell, fonts, header/footer
  globals.css              design tokens (colors, type, signature "film-perf" rule)
  page.tsx                 search page (client): search bar, filters, infinite scroll grid
  media/[id]/page.tsx       detail page (server): poster, trailer, cast, watch options
  api/
    search/route.ts         GET  /api/search?q=&type=&genres=&yearFrom=&yearTo=&language=&page=
    media/[id]/route.ts      GET  /api/media/:id?type=movie|tv

components/
  SiteHeader.tsx            marquee wordmark + bulb strip
  SearchBar.tsx              global search input
  FilterBar.tsx              type / genre / year range / language controls
  MediaCard.tsx               ticket-stub result card (+ skeleton)
  VideoPlayer.tsx             distraction-free trailer embed
  WatchBadges.tsx             Free / Subscription / Rent / Buy grouped links
  CastRow.tsx                  horizontally scrolling cast strip

lib/
  tmdb.ts                    server-only fetch layer: search, detail, credits,
                              videos, watch/providers — plus mock-data fallback

types/
  index.ts                   shared types + GENRES / LANGUAGES constants
```

## Design system

- **Palette**: near-black ink (`#0B0D10`) ground, warm marquee amber
  (`#E8A33D`) as the single accent, teal for "Free", rose for "Rent/Buy".
- **Type**: Fraunces (display, italic for editorial voice) + Inter (body) +
  IBM Plex Mono (metadata/labels, ticket-stub feel).
- **Signature device**: a sprocket-hole perforation rule (`.film-perf`) marks
  true section breaks only, and result/detail cards use a torn-ticket edge
  mask (`.ticket-tear`) — motifs pulled from actual cinema ephemera rather
  than generic dashboard chrome.

## Extending source coverage

To add another licensed data source (e.g. a regional provider not covered
by TMDb/JustWatch), extend `getMediaDetail` in `lib/tmdb.ts` to merge in
another `WatchOption[]` array using the same `tier` vocabulary
(`flatrate | free | ads | rent | buy`) — the UI needs no changes.
