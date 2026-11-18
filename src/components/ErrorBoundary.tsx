import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message =
      error instanceof Error ? error.message : typeof error === 'string' ? error : '';
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Unhandled render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center">
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-lg font-bold text-slate-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-500">
              The app hit an unexpected error while loading. Try refreshing the page.
            </p>
            {this.state.message && (
              <p className="mt-4 break-words rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
                {this.state.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
