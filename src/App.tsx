import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookMarked, Loader2, SearchX } from 'lucide-react';
import { supabase, type Book, type BookStatus, STATUS_ORDER } from '@/lib/supabase';
import AddBookForm from '@/components/AddBookForm';
import FilterTabs from '@/components/FilterTabs';
import BookCard from '@/components/BookCard';
import EmptyState from '@/components/EmptyState';
import SearchBox from '@/components/SearchBox';

type Filter = BookStatus | 'all';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const loadBooks = useCallback(async () => {
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    if (fetchError) {
      setError('Could not load your books. Please try again.');
      setLoading(false);
      return;
    }
    setBooks((data as Book[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { want_to_read: 0, reading: 0, completed: 0 };
    for (const b of books) c[b.status] = (c[b.status] ?? 0) + 1;
    return c;
  }, [books]);

  const filtered = useMemo(() => {
    const byStatus = filter === 'all' ? books : books.filter((b) => b.status === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byStatus;
    return byStatus.filter((b) => b.title.toLowerCase().includes(q));
  }, [books, filter, query]);

  const completedCount = counts.completed ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-slate-900 p-2 text-white">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-900 sm:text-lg">
                Reading List
              </h1>
              <p className="text-[11px] text-slate-500">Track books for your studies</p>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs text-slate-400">Books finished</p>
            <p className="text-lg font-bold text-emerald-600">{completedCount}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <AddBookForm onAdded={loadBooks} />
            <FilterTabs
              active={filter}
              counts={counts}
              total={books.length}
              onChange={setFilter}
            />
          </div>
          <SearchBox value={query} onChange={setQuery} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="mt-3 text-sm">Loading your books…</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-8 text-center">
            <p className="text-sm font-medium text-rose-700">{error}</p>
            <button
              onClick={loadBooks}
              className="mt-3 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            filtered={filter !== 'all' || query.trim() !== ''}
            searching={query.trim() !== ''}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} onChanged={loadBooks} />
            ))}
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <p className="mt-8 text-center text-xs text-slate-400">
            Showing {filtered.length} of {books.length}{' '}
            {books.length === 1 ? 'book' : 'books'}
            {query.trim() && ` matching “${query.trim()}”`}
          </p>
        )}
      </main>
    </div>
  );
}
