# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build (output: dist/)
npm run lint     # ESLint
npm run start    # Start production server
```

No test suite is configured.

## Architecture

**Next.js 15 App Router** website for a Ukrainian cultural museum (Музей памʼяті митрополита Андрея).

### Data flow

Firebase is the sole backend. `src/firebase.js` exports three instances — `auth`, `storage`, `firestore` — imported directly in pages/components wherever needed. There is no API layer or server actions; all Firestore/Storage calls happen client-side.

### Auth

- `AuthProvider` (mounted in `layout.js`) calls `initializeAuth()` on mount, which sets up a Firebase `onAuthStateChanged` listener.
- Auth state lives in `useAuthStore` (Zustand, `src/store/auth_store.js`). Every authenticated user is treated as admin (`isAdmin: true` is hardcoded — there is only one admin).
- Components consume auth via `useAuth` hook (`src/hooks/useAuth.js`), which is a thin wrapper around the store.
- Admin-only pages (e.g., `/create`) redirect to `/login` if `!isAuthenticated || !isAdmin`.

### Events

- Events are stored in the Firestore `events` collection with fields: `title`, `description` (HTML string from Tiptap), `start_date` (Firestore Timestamp), `end_date` (Timestamp or null), `images` (array of Storage download URLs), `createdAt`.
- `useEventStore` (`src/store/event_store.js`) is a temporary form buffer used only on the `/create` page. It holds in-progress `description` (from Tiptap) and `images` (up to 20). It is reset after a successful submit.
- Image uploads: files are compressed client-side via `compressImage` (max 1920px, JPEG at 0.85 quality), then uploaded to Firebase Storage under `events/{docId}/{imageId}`.

### Styling

CSS Modules (`.module.css`) per component. Global styles in `src/styles/global.css`. Fonts: Nunito + Oswald loaded from Google Fonts with Cyrillic subsets. SVGs are imported as React components via `@svgr/webpack`.

### Key conventions

- Path alias `@/*` maps to `src/*`.
- UI text is in Ukrainian.
- `"use client"` is required on any component that uses hooks, browser APIs, or event handlers — the default is Server Components.
- Build output goes to `dist/` (not the default `.next/`), configured as `standalone` in `next.config.mjs`.
