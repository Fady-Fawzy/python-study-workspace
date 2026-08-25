import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePracticeDraft } from './practiceDraft.mjs';

const validDraft = {
  lessonId: '020',
  questions: [{
    id: '020-test',
    type: 'predict-output',
    prompt: 'What is the output?',
    code: 'print(1 + 1)',
    output: '2',
    choices: ['2', '3'],
    correctAnswer: 0,
    explanation: '1 plus 1 equals 2.'
  }]
};

test('accepts a valid Gemini practice draft', () => {
  assert.deepEqual(validatePracticeDraft(validDraft, '020'), validDraft);
});

test('rejects drafts with missing explanations', () => {
  const invalid = structuredClone(validDraft);
  delete invalid.questions[0].explanation;

  assert.throws(() => validatePracticeDraft(invalid, '020'), /explanation/i);
});

test('rejects duplicate question IDs and invalid correct answers', () => {
  const duplicate = structuredClone(validDraft);
  duplicate.questions.push({ ...duplicate.questions[0] });
  assert.throws(() => validatePracticeDraft(duplicate, '020'), /duplicate/i);

  const invalidAnswer = structuredClone(validDraft);
  invalidAnswer.questions[0].correctAnswer = 4;
  assert.throws(() => validatePracticeDraft(invalidAnswer, '020'), /correct answer/i);
});
