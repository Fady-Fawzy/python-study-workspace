import React, { useState, useEffect } from 'react';
import { List, X } from 'lucide-react';
import { TocItem } from '../../types/content';

interface TableOfContentsProps {
  items: TocItem[];
}

const containsArabic = (text: string): boolean => /[\u0600-\u06ff]/.test(text);

function TocLabel({ text }: { text: string }) {
  const methodHeading = text.match(/^([A-Za-z_][A-Za-z0-9_.]*(?:\([^)]*\))?)\s*([—–-])\s*(.+)$/);

  if (methodHeading && containsArabic(methodHeading[3])) {
    return (
      <>
        <bdi dir="ltr">{methodHeading[1]}</bdi>
        {' '}{methodHeading[2]}{' '}{methodHeading[3]}
      </>
    );
  }

  return <>{text}</>;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length <= 1) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Floating Contents Trigger */}
      <div className="mobile-toc-trigger">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-surface-raised)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            color: 'var(--text-secondary)'
          }}
        >
          <List size={14} />
          <span>Contents ({items.length})</span>
        </button>
      </div>

      {/* Mobile Contents Bottom Modal */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 160,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '500px',
              backgroundColor: 'var(--bg-surface)',
              borderTopLeftRadius: 'var(--radius-xl)',
              borderTopRightRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              maxHeight: '70vh',
              overflowY: 'auto',
              borderTop: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-4)',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: 'var(--space-2)'
              }}
            >
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Lesson Contents</h3>
              <button type="button" onClick={() => setIsMobileOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {items.map((item) => {
                const isArabic = containsArabic(item.text);
                return (
                  <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToHeading(item.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: isArabic ? 'right' : 'left',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: activeId === item.id ? 'var(--accent-primary-muted)' : 'transparent',
                    color: activeId === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: activeId === item.id ? 600 : 400
                  }}
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  <TocLabel text={item.text} />
                </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar TOC */}
      <nav className="desktop-toc-container">
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
          On this page
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {items.map((item) => {
            const isActive = activeId === item.id;
            const isArabic = containsArabic(item.text);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToHeading(item.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: isArabic ? 'right' : 'left',
                  padding: `4px 8px 4px ${item.level > 2 ? '16px' : '8px'}`,
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--accent-primary-muted)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transition: 'all var(--transition-fast)'
                }}
                title={item.text}
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <TocLabel text={item.text} />
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        .desktop-toc-container {
          position: sticky;
          top: 80px;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
          width: var(--toc-width);
          flex-shrink: 0;
          padding-left: var(--space-4);
          border-left: 1px solid var(--border-subtle);
        }
        .mobile-toc-trigger {
          display: none;
          margin-bottom: var(--space-4);
        }
        @media (max-width: 1200px) {
          .desktop-toc-container {
            display: none;
          }
          .mobile-toc-trigger {
            display: block;
          }
        }
      `}</style>
    </>
  );
};
