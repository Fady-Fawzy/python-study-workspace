import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Code, CornerDownLeft, FileText, Search, X } from 'lucide-react';
import { SearchResult } from '../../types/content';
import { IndexedItem, searchIndexedItems } from '../../lib/searchIndex';
import { useModalDialog } from '../shared/useModalDialog';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  index: IndexedItem[];
  onSelectResult: (url: string) => void;
  commands?: SearchCommand[];
}

export interface SearchCommand {
  id: string;
  label: string;
  description: string;
  keywords?: string[];
  shortcut?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

const suggestions = ['020', '056', 'append', 'kwargs', 'lambda', 'filter', 'dict', 'while', 'open()'];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  index,
  onSelectResult,
  commands = []
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLUListElement>(null);
  const dialogRef = useModalDialog({ isOpen, onClose, initialFocusRef: inputRef });

  const results: SearchResult[] = useMemo(() => (
    query.trim() ? searchIndexedItems(query, index) : []
  ), [query, index]);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return commands;

    return commands.filter(command => [
      command.label,
      command.description,
      ...(command.keywords ?? [])
    ].some(value => value.toLocaleLowerCase().includes(normalizedQuery)));
  }, [commands, query]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setSelectedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const activeResult = resultsContainerRef.current?.querySelector<HTMLElement>(
      `[data-result-index="${selectedIndex}"]`
    );
    if (activeResult && typeof activeResult.scrollIntoView === 'function') {
      activeResult.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, results.length]);

  if (!isOpen) return null;

  const selectResult = (result: SearchResult) => {
    onSelectResult(result.url);
    onClose();
  };

  const selectCommand = (command: SearchCommand) => {
    command.onSelect();
    onClose();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex(previous => results.length ? (previous + 1) % results.length : 0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex(previous => results.length ? (previous - 1 + results.length) % results.length : 0);
    } else if (event.key === 'Enter') {
      const selected = results[selectedIndex];
      if (selected) {
        event.preventDefault();
        selectResult(selected);
      }
    }
  };

  const getResultIcon = (type: string) => {
    if (type === 'lesson') return <BookOpen size={18} aria-hidden="true" />;
    if (type === 'method') return <Code size={18} aria-hidden="true" />;
    return <FileText size={18} aria-hidden="true" />;
  };

  return (
    <div
      className="search-modal-backdrop"
      data-testid="search-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="search-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-search-title"
      >
        <div className="search-modal__header">
          <h2 id="global-search-title" className="visually-hidden">Search Python Study Workspace</h2>
          <Search size={20} aria-hidden="true" />
          <label className="visually-hidden" htmlFor="global-search-input">
            Search lessons, syntax, and methods
          </label>
          <input
            ref={inputRef}
            id="global-search-input"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search lessons, syntax, methods…"
            autoComplete="off"
            aria-controls="global-search-results"
          />
          {query && (
            <button
              type="button"
              className="ui-icon-button search-modal__clear"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="ui-icon-button search-modal__close"
            onClick={onClose}
            aria-label="Close search"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="search-modal__body">
          {!query.trim() && filteredCommands.length === 0 && (
            <div className="search-modal__empty">
              <p>Search by lesson number, method, or Python keyword.</p>
              <div className="search-modal__suggestions" aria-label="Suggested searches">
                {suggestions.map(sample => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setQuery(sample);
                      setSelectedIndex(0);
                      inputRef.current?.focus();
                    }}
                  >
                    <bdi dir="ltr">{sample}</bdi>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredCommands.length > 0 && (
            <section className="search-modal__commands" aria-labelledby="search-quick-actions-title">
              <h3 id="search-quick-actions-title">Quick actions</h3>
              <div className="search-modal__command-list">
                {filteredCommands.map(command => (
                  <button
                    key={command.id}
                    type="button"
                    className="search-modal__command"
                    data-command-id={command.id}
                    onClick={() => selectCommand(command)}
                    aria-label={`Run command: ${command.label}`}
                  >
                    <span className="search-modal__command-icon" aria-hidden="true">
                      {command.icon ?? <CornerDownLeft size={16} />}
                    </span>
                    <span className="search-modal__command-copy">
                      <span className="search-modal__command-label">{command.label}</span>
                      <span className="search-modal__command-description">{command.description}</span>
                    </span>
                    {command.shortcut && (
                      <kbd className="search-modal__command-shortcut">{command.shortcut}</kbd>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {query.trim() && results.length === 0 && filteredCommands.length === 0 && (
            <p className="search-modal__no-results" role="status">
              No matches found for &ldquo;{query}&rdquo;
            </p>
          )}

          <ul
            ref={resultsContainerRef}
            id="global-search-results"
            className="search-modal__results"
            aria-label="Search results"
          >
            {results.map((result, indexValue) => (
              <li key={result.id}>
                <button
                  id={`global-search-result-${indexValue}`}
                  type="button"
                  className="search-modal__result"
                  data-active={indexValue === selectedIndex || undefined}
                  data-result-index={indexValue}
                  onMouseEnter={() => setSelectedIndex(indexValue)}
                  onClick={() => selectResult(result)}
                  aria-label={`Open search result: ${result.title}`}
                >
                  <span className="search-modal__result-icon" data-type={result.type}>
                    {getResultIcon(result.type)}
                  </span>
                  <span className="search-modal__result-copy">
                    <span className="search-modal__result-heading">
                      <span>{result.title}</span>
                      <span className="search-modal__badge">{result.badge}</span>
                    </span>
                    <span className="search-modal__subtitle">{result.subtitle}</span>
                  </span>
                  <span className="search-modal__result-arrow" aria-hidden="true">
                    {indexValue === selectedIndex ? <CornerDownLeft size={16} /> : <ArrowRight size={16} />}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="visually-hidden" role="status" aria-live="polite">
            {results[selectedIndex] ? `Selected: ${results[selectedIndex].title}` : ''}
          </p>
        </div>

        {results.length > 0 && (
          <div className="search-modal__footer" aria-hidden="true">
            <span>↑ ↓ Navigate</span>
            <span>↵ Select · ESC Close</span>
          </div>
        )}
      </div>
    </div>
  );
};
