import { describe, expect, it } from 'vitest';
import { SyntaxSubsection } from '../types/content';
import { getQuickReviewPurpose } from './quickReview';

function subsection(heading: string, code = 'items.clear()'): SyntaxSubsection {
  return {
    id: heading || 'core',
    heading,
    level: 2,
    content: '',
    codeBlocks: [{ code, language: 'python' }]
  };
}

describe('quick review descriptions', () => {
  it('gives common Python elements a concise purpose when source prose is absent', () => {
    expect(getQuickReviewPurpose(subsection('sort()'))).toMatch(/sorts the list in place/i);
    expect(getQuickReviewPurpose(subsection('pop()'))).toMatch(/removes and returns/i);
  });

  it('uses meaningful code comments for operator-style syntax', () => {
    const operatorSubsection = subsection(
      '',
      'a + b     # Addition\na // b    # Floor Division'
    );

    expect(getQuickReviewPurpose(operatorSubsection)).toMatch(/addition.*floor division/i);
  });
});
