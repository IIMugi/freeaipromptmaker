'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class GeneratorErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[Generator Error]', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="section-shell rounded-2xl p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-rose-soft)]">
                        <AlertTriangle className="h-7 w-7 text-[var(--accent-rose)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Generator encountered an error
                    </h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        Something went wrong while loading the prompt generator. Try refreshing.
                    </p>
                    <button
                        type="button"
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--accent-primary-strong)] bg-[var(--accent-primary-soft)] px-4 py-2 text-sm font-medium text-[var(--accent-primary)] transition hover:bg-[var(--accent-primary-strong)]"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
