import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, BookOpen, Code, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SearchResult } from '../../types/content';
import { IndexedItem, searchIndexedItems } from '../../lib/searchIndex';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  index: IndexedItem[];
  onSelectResult: (url: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  index,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    return searchIndexedItems(query, index);
  }, [query, index]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        onSelectResult(selected.url);
        onClose();
      }
    }
  };

  // Ensure active result stays visible in scroll container
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen size={16} color="var(--accent-primary)" />;
      case 'method':
        return <Code size={16} color="var(--accent-gold)" />;
      default:
        return <FileText size={16} color="var(--accent-success)" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 'min(12vh, 100px)',
        paddingLeft: 'var(--space-4)',
        paddingRight: 'var(--space-4)',
        zIndex: 150
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '75vh'
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-raised)'
          }}
        >
          <Search size={18} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search lessons (e.g. 56), syntax, methods (append, kwargs, filter)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 'var(--text-base)',
              color: 'var(--text-primary)'
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              style={{ color: 'var(--text-muted)', display: 'flex' }}
            >
              <X size={16} />
            </button>
          )}
          <kbd
            style={{
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)'
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={resultsContainerRef}
          style={{
            overflowY: 'auto',
            padding: 'var(--space-2)',
            flex: 1
          }}
        >
          {query.trim() && results.length === 0 && (
            <div style={{ padding: 'var(--space-8) var(--space-4)', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matches found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!query.trim() && (
            <div style={{ padding: 'var(--space-6) var(--space-4)', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                Type a lesson number, method name, or Python keyword:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', justifyContent: 'center' }}>
                {['020', '056', 'append', 'kwargs', 'lambda', 'filter', 'dict', 'while', 'open()'].map(sample => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setQuery(sample);
                      setSelectedIndex(0);
                    }}
                    style={{
                      padding: '3px 8px',
                      fontSize: 'var(--text-xs)',
                      fontFamily: 'var(--font-mono)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((result, idx) => (
            <div
              key={result.id}
              onClick={() => {
                onSelectResult(result.url);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: idx === selectedIndex ? 'var(--bg-surface-hover)' : 'transparent',
                border: `1px solid ${idx === selectedIndex ? 'var(--border-default)' : 'transparent'}`,
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
                gap: 'var(--space-3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', minWidth: 0 }}>
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {getResultIcon(result.type)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {result.title}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-badge)',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {result.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {result.subtitle}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: idx === selectedIndex ? 'var(--accent-primary)' : 'var(--text-muted)', flexShrink: 0 }}>
                {idx === selectedIndex ? <CornerDownLeft size={14} /> : <ArrowRight size={14} />}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        {results.length > 0 && (
          <div
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-raised)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'var(--text-muted)'
            }}
          >
            <span>Use ↑ ↓ to navigate</span>
            <span>↵ Select • ESC Close</span>
          </div>
        )}
      </div>
    </div>
  );
};
