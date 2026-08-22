import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { highlightCode } from '../../lib/syntaxHighlight';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'python', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const highlightedHtml = highlightCode(code, language);

  return (
    <div className="code-container" dir="ltr">
      <div className="code-header">
        <span className="code-header-lang">
          {title ? `${title} (${language})` : language}
        </span>
        <div className="code-header-actions">
          <button
            type="button"
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            aria-label={copied ? 'Copied code to clipboard' : 'Copy code to clipboard'}
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
      <pre className="code-pre">
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  );
};
