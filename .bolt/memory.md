# Project memory

## Product intent & audience

- Book tracking/library app: users can load, add, edit, rate, and delete books.
- Fully standalone: runs entirely in the browser via localStorage — no backend, API keys, or network calls.
- Deployed via GitHub Pages (no environment variables required anymore).

## Brand personality & voice

- Friendly, user-facing error messages (e.g., "Something went wrong").
- Design goal is "beautiful, not cookie cutter" and production-worthy (per `.bolt/prompt`).

## Visual design & UX direction

- React error boundary wraps the whole app as a safety net; shows a readable error screen with a refresh button.
- Tailwind CSS for styling; Lucide React icons for UI/logo (per `.bolt/prompt`).
- Defensive UX: localStorage operations include duplicate-title checks and graceful error handling.
- Cross-tab sync: changes in one tab automatically refresh other open tabs via storage events.

## Decisions, constraints & rationale

- Data layer replaced from Supabase to a localStorage module (`@/lib/localStorage` or equivalent); all components (App, AddBookForm, BookCard, FilterTabs) import from it via `@/` alias.
- No Supabase client instantiation, no env vars, no GitHub secrets needed.
- Old `supabase.ts` module removed entirely; no remaining references.
- Bundle dropped from 293KB to 167KB (Supabase library no longer bundled).
- IDs generated via `crypto.randomUUID()` for book entries.
- Deploy workflow simplified — no build-time environment baking needed.
- Error boundary retained as defensive safety net even though the credential crash root cause is gone.

## Open questions & assumptions

- localStorage is per-browser; data does not sync across devices or persist if cache is cleared.
- No explicit data export/import yet — if users clear browser data, their library is lost.