import { BookOpen, SearchX } from 'lucide-react';

interface EmptyStateProps {
  filtered: boolean;
  searching?: boolean;
}

export default function EmptyState({ filtered, searching }: EmptyStateProps) {
  if (searching) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 px-6 py-16 text-center">
        <div className="mb-4 rounded-2xl bg-slate-100 p-3 text-slate-400">
          <SearchX className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-slate-600">No books match your search</p>
        <p className="mt-1 text-xs text-slate-400">
          Try a different title or clear the search.
        </p>
      </div>
    );
  }

  if (filtered) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 px-6 py-16 text-center">
        <div className="mb-4 rounded-2xl bg-slate-100 p-3 text-slate-400">
          <BookOpen className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-slate-600">No books in this shelf</p>
        <p className="mt-1 text-xs text-slate-400">
          Try a different filter or add a new book.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-gradient-to-b from-white to-slate-50 px-6 py-20 text-center">
      <div className="mb-5 rounded-3xl bg-slate-900 p-4 text-white shadow-lg">
        <BookOpen className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">No books yet</h3>
      <p className="mt-2 max-w-xs text-sm text-slate-500">
        Build your reading list by adding your first book. Track what you want to read,
        what you&apos;re reading, and what you&apos;ve finished.
      </p>
    </div>
  );
}
