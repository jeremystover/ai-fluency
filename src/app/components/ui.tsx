import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes, type Ref } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import { useApp } from '../brand';
import DifferenceModal from './DifferenceModal';

marked.setOptions({ gfm: true, breaks: false });

// First-party seeded content only — never user input.
export function Markdown({ source, className }: { source: string; className?: string }) {
  const html = marked.parse(source, { async: false });
  const wrapped = html.replace(/<table>/g, '<div class="md-table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
  return <div className={`md ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: wrapped }} />;
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'quiet'; ref?: Ref<HTMLButtonElement> }) {
  const base =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const styles =
    variant === 'primary'
      ? 'bg-accent text-on-accent hover:brightness-110 active:brightness-95'
      : 'bg-transparent text-ink-strong border border-line-strong hover:border-ink-strong';
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}

// Moves focus to the top of each screen so keyboard users don't lose their place.
export function Screen({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, []);
  return (
    <main ref={ref} tabIndex={-1} className={`outline-none w-full mx-auto px-5 pb-[calc(5rem+env(safe-area-inset-bottom))] ${wide ? 'max-w-5xl' : 'max-w-2xl'}`}>
      {children}
    </main>
  );
}

export function Header() {
  const { brand } = useApp();
  const [showDifference, setShowDifference] = useState(false);
  return (
    <header className="w-full border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-40 pt-safe">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-baseline gap-2.5 no-underline min-w-0">
          <span className="font-display font-bold text-ink-strong text-lg tracking-tight whitespace-nowrap">AI Fluency</span>
          {brand && <span className="label-utility mt-0.5 truncate hidden min-[420px]:inline">for {brand.name}</span>}
        </Link>
        <button
          onClick={() => setShowDifference(true)}
          className="font-utility text-[0.7rem] uppercase tracking-wider text-accent hover:text-ink-strong whitespace-nowrap shrink-0 py-3 -my-3"
        >
          <span className="hidden sm:inline">How is this different?</span>
          <span className="sm:hidden">Different?</span>
        </button>
      </div>
      <DifferenceModal open={showDifference} onClose={() => setShowDifference(false)} />
    </header>
  );
}

export function Footer() {
  const { brand } = useApp();
  return (
    <footer className="w-full border-t border-line mt-auto">
      <div className="max-w-5xl mx-auto px-5 py-6 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <span className="label-utility">AI Fluency for People Leaders — demonstration build</span>
        {brand && <span className="text-xs text-muted">{brand.voice.signoff}</span>}
      </div>
    </footer>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div role="alert" className="border border-danger/40 bg-danger/5 text-danger rounded-brand px-4 py-3 text-sm">
      {message}
    </div>
  );
}
