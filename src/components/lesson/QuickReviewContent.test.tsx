import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SyntaxSection } from '../../types/content';
import { QuickReviewContent } from './QuickReviewContent';

const syntaxSection: SyntaxSection = {
  id: 3,
  number: 3,
  title: 'List Methods',
  category: 'Data Structures',
  rawMarkdown: '',
  methods: ['append()', 'extend()'],
  subsections: [
    {
      id: 'append',
      heading: 'append()',
      level: 2,
      content: 'Add one item at the end of the list.',
      codeBlocks: [{ code: 'items.append("Python")', language: 'python' }]
    },
    {
      id: 'examples',
      heading: 'Examples',
      level: 2,
      content: 'Use the method when you want to add a single value.',
      codeBlocks: [{ code: 'items.append("CSS")', language: 'python' }]
    }
  ]
};

describe('QuickReviewContent', () => {
  it('presents each syntax item as a fast documentation entry', () => {
    render(
      <QuickReviewContent
        syntaxSections={[syntaxSection]}
        onOpenFullReference={vi.fn()}
      />
    );

    const card = screen.getByRole('region', { name: /list methods/i });
    expect(within(card).getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(within(card).getAllByText('What it does')).toHaveLength(2);
    expect(within(card).getAllByText('Syntax')).toHaveLength(1);
    expect(within(card).getAllByText('Example')).toHaveLength(1);
    expect(
      Array.from(card.querySelectorAll('code')).some(code => code.textContent === 'items.append("Python")')
    ).toBe(true);
    expect(within(card).getByText('Add one item at the end of the list.')).toBeInTheDocument();
  });
});
