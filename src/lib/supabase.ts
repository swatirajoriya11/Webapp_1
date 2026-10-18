import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
