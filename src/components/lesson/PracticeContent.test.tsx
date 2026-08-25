import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PracticeLesson } from '../../types/practice';
import { PracticeContent } from './PracticeContent';

const practiceLesson: PracticeLesson = {
  id: '020',
  number: 20,
  title: 'Arithmetic Operators',
  questions: [
    {
      id: 'first',
      type: 'predict-output',
      prompt: 'What does this print?',
      code: 'print(1 + 1)',
      output: '2',
      choices: ['2', '3'],
      correctAnswer: 0,
      explanation: 'Addition produces 2.'
    },
    {
      id: 'second',
      type: 'multiple-choice',
      prompt: 'Which operator adds values?',
      choices: ['+', '*'],
      correctAnswer: 0,
      explanation: 'The plus operator performs addition.'
    }
  ]
};

describe('PracticeContent', () => {
  it('lets a learner answer, read the explanation, finish, and restart a practice run', async () => {
    const user = userEvent.setup();
    const onProgressChange = vi.fn();

    render(
      <PracticeContent
        lesson={practiceLesson}
        onProgressChange={onProgressChange}
      />
    );

    expect(screen.getByRole('heading', { name: /question 1 of 2/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

    await user.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByRole('status', { name: 'Correct' })).toBeInTheDocument();
    expect(screen.getByText('Addition produces 2.')).toBeInTheDocument();
    expect(onProgressChange).toHaveBeenLastCalledWith(expect.objectContaining({
      score: 1,
      answers: { first: 0 }
    }));

    await user.click(screen.getByRole('button', { name: /next question/i }));
    expect(screen.getByRole('heading', { name: /question 2 of 2/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '*' }));
    expect(screen.getByRole('status', { name: 'Not quite' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /finish practice/i }));

    expect(screen.getByRole('heading', { name: /practice complete/i })).toBeInTheDocument();
    expect(screen.getByText(/1\/2 correct/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /restart practice/i }));
    expect(screen.getByRole('heading', { name: /question 1 of 2/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });
});
