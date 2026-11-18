const STORAGE_KEY = 'reading-list-books';

export type BookStatus = 'want_to_read' | 'reading' | 'completed';

export interface Book {
  id: string;
  title: string;
  author: string | null;
  cover_color: string;
  status: BookStatus;
  rating: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewBookInput {
  title: string;
  author: string | null;
  cover_color: string;
  status: BookStatus;
}

export interface Result {
  error?: string;
}

function read(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Book[]) : [];
  } catch {
    return [];
  }
}

function write(books: Book[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function now(): string {
  return new Date().toISOString();
}

export function getBooks(): Book[] {
  return read().sort((a, b) => a.created_at < b.created_at ? 1 : -1);
}

export function addBook(input: NewBookInput): Result {
  const books = read();
  const titleLower = input.title.toLowerCase();
  if (books.some((b) => b.title.toLowerCase() === titleLower)) {
    return { error: 'duplicate' };
  }
  const book: Book = {
    id: crypto.randomUUID(),
    title: input.title,
    author: input.author,
    cover_color: input.cover_color,
    status: input.status,
    rating: null,
    notes: null,
    created_at: now(),
    updated_at: now(),
  };
  books.push(book);
  write(books);
  return {};
}

export function updateBook(id: string, fields: Partial<Book>): Result {
  const books = read();
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return { error: 'not-found' };
  books[idx] = { ...books[idx], ...fields, updated_at: now() };
  write(books);
  return {};
}

export function deleteBook(id: string): Result {
  const books = read().filter((b) => b.id !== id);
  write(books);
  return {};
}

export const STATUS_META: Record<
  BookStatus,
  { label: string; color: string; ring: string; dot: string; badge: string }
> = {
  want_to_read: {
    label: 'Want to Read',
    color: 'text-amber-700',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  reading: {
    label: 'Reading',
    color: 'text-sky-700',
    ring: 'ring-sky-200',
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-700',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

export const STATUS_ORDER: BookStatus[] = ['reading', 'want_to_read', 'completed'];

export const COVER_COLORS = [
  'blue',
  'emerald',
  'amber',
  'rose',
  'violet',
  'cyan',
  'orange',
  'teal',
] as const;

export const COVER_COLOR_CLASSES: Record<string, string> = {
  blue: 'from-blue-500 to-blue-700',
  emerald: 'from-emerald-500 to-emerald-700',
  amber: 'from-amber-500 to-amber-600',
  rose: 'from-rose-500 to-rose-700',
  violet: 'from-violet-500 to-violet-700',
  cyan: 'from-cyan-500 to-cyan-700',
  orange: 'from-orange-500 to-orange-700',
  teal: 'from-teal-500 to-teal-700',
};
