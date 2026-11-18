# Project memory

## Product intent & audience

- Book tracking/library app: users can load, add, edit, rate, and delete books.
- Deployed via GitHub Pages (build-time environment baking required).

## Brand personality & voice

- Friendly, user-facing error messages (e.g., "Database is not configured", "Something went wrong").
- Design goal is "beautiful, not cookie cutter" and production-worthy (per `.bolt/prompt`).

## Visual design & UX direction

- React error boundary wraps the whole app: shows a readable error screen with a refresh button instead of a blank white page.
- Error banner component already exists in the app; reused for the "not configured" state.
- Lucide React icons used for UI/logo (per `.bolt/prompt`); Tailwind CSS for styling.
- Defensive UX: all database operations check configuration status before proceeding and display friendly messages rather than throwing.

## Decisions, constraints & rationale

- Supabase client is only instantiated when credentials (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) actually exist at build time — prevents creating a client with `undefined` values.
- `isSupabaseConfigured` guard wraps every database call (load, add, edit, rate, delete books).
- Root cause of previous crash: missing Supabase credentials on GitHub Pages caused an `Error` object to be rendered as a React child, triggering Minified React error #31; the production minified build obscures the message.
- GitHub Pages deploy requires repository secrets named `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, referenced in the deploy workflow's build step.

## Open questions & assumptions

- User still needs to add Supabase credentials as GitHub repository secrets and wire them into the deploy workflow build step.
- Until credentials are configured, the app renders correctly but shows the "not configured" banner.