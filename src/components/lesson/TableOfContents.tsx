import React, { useEffect, useRef, useState } from 'react';
import { List, X } from 'lucide-react';
import { TocItem } from '../../types/content';
import { CLOSE_TRANSIENT_OVERLAYS_EVENT } from '../../lib/overlayEvents';

interface TableOfContentsProps {
  items: TocItem[];
  variant?: 'mobile' | 'desktop' | 'both';
}

const focusableSelector = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

const containsArabic = (text: string): boolean => /[\u0600-\u06ff]/.test(text);
const latinTerm = String.raw`[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*(?:\([^()\n]*\))?`;
const latinPhrasePattern = new RegExp(`${latinTerm}(?:[ \t]+${latinTerm})*`, 'g');

function TocLabel({ text }: { text: string }) {
  if (!containsArabic(text)) return <>{text}</>;

  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(latinPhrasePattern)) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) segments.push(text.slice(lastIndex, matchIndex));
    segments.push(<bdi key={`${matchIndex}-${match[0]}`} dir="ltr">{match[0]}</bdi>);
    lastIndex = matchIndex + match[0].length;
  }
  if (lastIndex < text.length) segments.push(text.slice(lastIndex));

  return <>{segments}</>;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  variant = 'both'
}) => {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const showMobile = variant !== 'desktop';
  const showDesktop = variant !== 'mobile';

  useEffect(() => {
    if (!items.some(item => item.id === activeId)) {
      setActiveId(items[0]?.id ?? '');
    }
  }, [activeId, items]);

  useEffect(() => {
    if (items.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      entries => {
        const visibleHeading = entries.find(entry => entry.isIntersecting);
        if (visibleHeading) setActiveId(visibleHeading.target.id);
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    items.forEach(item => {
      const heading = document.getElementById(item.id);
      if (heading) observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const originalOverflow = document.body.style.overflow;
    const returnTarget = triggerRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMobileOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !sheetRef.current) return;
      const focusable = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      returnTarget?.focus({ preventScroll: true });
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const closeForAnotherOverlay = () => setIsMobileOpen(false);
    window.addEventListener(CLOSE_TRANSIENT_OVERLAYS_EVENT, closeForAnotherOverlay);
    return () => window.removeEventListener(CLOSE_TRANSIENT_OVERLAYS_EVENT, closeForAnotherOverlay);
  }, []);

  if (items.length <= 1) return null;

  const scrollToHeading = (id: string) => {
    const heading = document.getElementById(id);
    const reduceMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    heading?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setActiveId(id);
    setIsMobileOpen(false);
  };

  const renderItems = (location: 'mobile' | 'desktop') => (
    <div className={`lesson-toc__items lesson-toc__items--${location}`}>
      {items.map(item => {
        const isActive = activeId === item.id;
        const isArabic = containsArabic(item.text);
        return (
          <button
            key={item.id}
            type="button"
            className="lesson-toc__item"
            data-active={isActive || undefined}
            data-level={item.level}
            aria-current={isActive ? 'location' : undefined}
            aria-label={item.text}
            onClick={() => scrollToHeading(item.id)}
            title={location === 'desktop' ? item.text : undefined}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <TocLabel text={item.text} />
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {showMobile && (
        <div className="mobile-toc-trigger">
          <button
            ref={triggerRef}
            type="button"
            className="mobile-toc-trigger__button"
            aria-label={`Open lesson contents, ${items.length} sections`}
            aria-haspopup="dialog"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-lesson-contents"
            onClick={() => setIsMobileOpen(true)}
          >
            <List size={18} aria-hidden="true" />
            <span>Lesson contents</span>
            <span className="mobile-toc-trigger__count">{items.length}</span>
          </button>
        </div>
      )}

      {showMobile && isMobileOpen && (
        <div
          className="lesson-toc-backdrop"
          data-testid="mobile-toc-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setIsMobileOpen(false);
          }}
        >
          <div
            ref={sheetRef}
            id="mobile-lesson-contents"
            className="lesson-toc-sheet ui-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-lesson-contents-title"
          >
            <div className="lesson-toc-sheet__header">
              <div>
                <h2 id="mobile-lesson-contents-title">Lesson contents</h2>
                <p>{items.length} sections</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="ui-icon-button"
                aria-label="Close lesson contents"
                onClick={() => setIsMobileOpen(false)}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav className="lesson-toc-sheet__body" aria-label="Lesson sections">
              {renderItems('mobile')}
            </nav>
          </div>
        </div>
      )}

      {showDesktop && (
        <nav className="desktop-toc-container" aria-label="On this page">
          <div className="desktop-toc__title">On this page</div>
          {renderItems('desktop')}
        </nav>
      )}
    </>
  );
};
