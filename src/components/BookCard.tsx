import { useState } from 'react';
import { MoreVertical, Star, Trash2, Pencil, Check, X, Loader2 } from 'lucide-react';
import {
  supabase,
  type Book,
  type BookStatus,
  STATUS_META,
  STATUS_ORDER,
  COVER_COLOR_CLASSES,
} from '@/lib/supabase';

interface BookCardProps {
  book: Book;
  onChanged: () => void;
}

export default function BookCard({ book, onChanged }: BookCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(book.title);
  const [editAuthor, setEditAuthor] = useState(book.author ?? '');
  const [editRating, setEditRating] = useState<number | null>(book.rating);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function changeStatus(newStatus: BookStatus) {
    setMenuOpen(false);
    if (newStatus === book.status) return;
    setBusy(true);
    setError(null);
    const { error: updateError } = await supabase
      .from('books')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', book.id);
    setBusy(false);
    if (updateError) {
      setError('Could not update status.');
      return;
    }
    onChanged();
  }

  async function removeBook() {
    setMenuOpen(false);
    setBusy(true);
    setError(null);
    const { error: deleteError } = await supabase.from('books').delete().eq('id', book.id);
    setBusy(false);
    if (deleteError) {
      setError('Could not delete the book.');
      return;
    }
    onChanged();
  }

  async function saveEdit() {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setError('Title cannot be empty.');
      return;
    }
    setBusy(true);
    setError(null);
    const { error: updateError } = await supabase
      .from('books')
      .update({
        title: trimmed,
        author: editAuthor.trim() || null,
        rating: editRating,
        updated_at: new Date().toISOString(),
      })
      .eq('id', book.id);
    setBusy(false);
    if (updateError) {
      setError('Could not save changes.');
      return;
    }
    setEditing(false);
    onChanged();
  }

  async function setRating(value: number) {
    const next = book.rating === value ? null : value;
    setEditRating(next);
    setBusy(true);
    setError(null);
    const { error: updateError } = await supabase
      .from('books')
      .update({ rating: next, updated_at: new Date().toISOString() })
      .eq('id', book.id);
    setBusy(false);
    if (updateError) {
      setError('Could not save rating.');
      return;
    }
    onChanged();
  }

  const statusMeta = STATUS_META[book.status];
  const coverGradient = COVER_COLOR_CLASSES[book.cover_color] ?? COVER_COLOR_CLASSES.blue;

  if (editing) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Title</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Author</label>
            <input
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEditRating(n)}
                  className="p-0.5"
                  aria-label={`Rate ${n}`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      (editRating ?? 0) >= n
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
            <button
              type="button"
              onClick={saveEdit}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className={`relative h-28 bg-gradient-to-br ${coverGradient}`}>
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <span className="line-clamp-2 text-center text-sm font-semibold leading-tight text-white/95 drop-shadow-sm">
            {book.title}
          </span>
        </div>
        <div className="absolute right-2 top-2">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg bg-white/20 p-1.5 text-white backdrop-blur-sm transition hover:bg-white/30"
            aria-label="Book actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Move to
                </div>
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(s)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                      book.status === s ? 'font-semibold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${STATUS_META[s].dot}`} />
                    {STATUS_META[s].label}
                    {book.status === s && <Check className="ml-auto h-3.5 w-3.5" />}
                  </button>
                ))}
                <div className="my-1 h-px bg-slate-100" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setEditing(true);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit details
                </button>
                <button
                  onClick={removeBook}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">{book.title}</h3>
          {book.author && (
            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{book.author}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusMeta.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
            {statusMeta.label}
          </span>

          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className="p-0.5 transition hover:scale-110"
                aria-label={`Rate ${n} stars`}
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    (book.rating ?? 0) >= n
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {busy && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin" /> Saving…
          </div>
        )}
        {error && <p className="text-[11px] font-medium text-rose-600">{error}</p>}
      </div>
    </div>
  );
}
