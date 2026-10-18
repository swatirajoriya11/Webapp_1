/*
# Prevent duplicate books by title

1. Changes
- Add a unique index on a normalized (lowercased, trimmed) version of `books.title`.
- This blocks inserts/updates that would create a second book with the same title,
  ignoring case and surrounding whitespace.
2. Security
- No RLS or policy changes.
3. Notes
- The check is case-insensitive and trims whitespace, so "The Great Gatsby",
  "the great gatsby", and "  The Great Gatsby  " are treated as the same book.
- Author and other fields are not part of the uniqueness check, since students
  often re-add a book by title only.
- This is a unique INDEX (not a constraint column), so it does not alter the
  table structure and is safe to add to an existing table.
*/

CREATE UNIQUE INDEX IF NOT EXISTS books_unique_title_idx
  ON books (lower(btrim(title)));
