import Prism from 'prismjs';
import 'prismjs/components/prism-python';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function highlightCode(code: string, language: string = 'python'): string {
  const cleanLang = language.toLowerCase().trim();
  const validLang = (cleanLang === 'python' || cleanLang === 'py') ? 'python' : cleanLang;

  try {
    if (Prism.languages[validLang]) {
      return Prism.highlight(code, Prism.languages[validLang], validLang);
    }
  } catch (e) {
    console.warn('Prism highlighting failed for', validLang, e);
  }

  // Fallback to escaped HTML
  return escapeHtml(code);
}
