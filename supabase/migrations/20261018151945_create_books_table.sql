/*
# Create books table (single-tenant, no auth)

1. New Tables
- `books`
- `id` (uuid, primary key)
- `title` (text, not null)
- `author` (text)
- `cover_color` (text, default accent color for card visual)
- `status` (text, one of: 'want_to_read', 'reading', 'completed', default 'want_to_read')
- `rating` (int, nullable, 1-5)
- `notes` (text, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
2. Security
- Enable RLS on `books`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in app).
- Add a check constraint to keep status values valid.
*/

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text,
  cover_color text NOT NULL DEFAULT 'blue',
  status text NOT NULL DEFAULT 'want_to_read'
    CHECK (status IN ('want_to_read', 'reading', 'completed')),
  rating int CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_books" ON books;
CREATE POLICY "anon_select_books" ON books FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_books" ON books;
CREATE POLICY "anon_insert_books" ON books FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_books" ON books;
CREATE POLICY "anon_update_books" ON books FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_books" ON books;
CREATE POLICY "anon_delete_books" ON books FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS books_status_idx ON books (status);
CREATE INDEX IF NOT EXISTS books_created_at_idx ON books (created_at DESC);
