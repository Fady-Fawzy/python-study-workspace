import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { highlightCode } from '../../lib/syntaxHighlight';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'python', title }) => {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        resetTimerRef.current = null;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const highlightedHtml = highlightCode(code, language);
  const languageName = language.toLowerCase() === 'python' ? 'Python' : language;
  const displayLabel = title ? `${title} (${language})` : `${languageName} code example`;

  return (
    <section
      className="code-container code-notebook"
      dir="ltr"
      role="region"
      aria-label={displayLabel}
      data-copy-state={copied ? 'copied' : 'idle'}
    >
      <div className="code-header">
        <span className="code-header-lang">
          {title ? displayLabel : languageName}
        </span>
        <div className="code-header-actions">
          <button
            type="button"
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            aria-label={copied ? `Copied ${languageName} code` : `Copy ${languageName} code`}
          >
            {copied ? (
              <>
                <Check size={13} strokeWidth={2.5} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} strokeWidth={2} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="code-pre" dir="ltr">
        <code
          className={`language-${language}`}
          dir="ltr"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied ? 'Code copied to clipboard' : ''}
      </span>
    </section>
  );
};
