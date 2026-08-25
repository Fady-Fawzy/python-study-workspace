import { PracticeLesson } from '../../types/practice';

export const practiceLesson024: PracticeLesson = {
  id: '024',
  number: 24,
  title: 'Tuples And Methods Part 1',
  questions: [
    {
      id: '024-tuple-model',
      type: 'multiple-choice',
      prompt: 'Which description best matches a Python Tuple?',
      choices: ['An ordered, immutable sequence', 'An unordered, mutable sequence', 'A sequence that cannot contain duplicates', 'A sequence that accepts only numbers'],
      correctAnswer: 0,
      explanation: 'A Tuple keeps order and supports indexing, but its item assignment cannot be changed after creation.'
    },
    {
      id: '024-comma-structure',
      type: 'behavior',
      prompt: 'What fundamentally creates a Tuple literal?',
      code: 'tuple_one = ("Ahmed", "Mohamed")\ntuple_two = "Ahmed", "Mohamed"',
      choices: ['The comma between values', 'The number of parentheses', 'The quotation marks', 'The variable name'],
      correctAnswer: 0,
      explanation: 'Parentheses improve readability, but the comma is what creates the Tuple structure. A comma can create a Tuple even without parentheses.'
    },
    {
      id: '024-indexing',
      type: 'predict-output',
      prompt: 'What does numbers[-1] return?',
      code: 'numbers = (10, 20, 30)\nprint(numbers[-1])',
      output: '30',
      choices: ['30', '10', '20', '-1'],
      correctAnswer: 0,
      explanation: 'Tuples use the same zero-based and negative indexing model as Lists. -1 means the last item, 30.'
    },
    {
      id: '024-immutable-error',
      type: 'behavior',
      prompt: 'What happens when this assignment runs?',
      code: 'numbers = (1, 2, 3)\nnumbers[1] = 100',
      output: 'TypeError',
      choices: ['TypeError because Tuple items cannot be assigned', 'The Tuple becomes (1, 100, 3)', 'The item is silently ignored', 'The Tuple changes into a List'],
      correctAnswer: 0,
      explanation: 'Tuple immutability prevents item assignment. Python raises TypeError instead of changing the value at index 1.'
    },
    {
      id: '024-fixed-data',
      type: 'multiple-choice',
      prompt: 'Why can immutability be useful for a Tuple?',
      choices: ['It communicates that related values should stay fixed', 'It makes every operation faster than a List', 'It automatically sorts the values', 'It prevents indexing'],
      correctAnswer: 0,
      explanation: 'A Tuple is a useful way to group values that should not be modified accidentally, such as a fixed record of related data.'
    },
    {
      id: '024-list-vs-tuple',
      type: 'behavior',
      prompt: 'Which comparison is correct?',
      choices: ['A List is mutable; a Tuple is immutable', 'A List is immutable; a Tuple is mutable', 'Both reject duplicate values', 'Neither supports indexes'],
      correctAnswer: 0,
      explanation: 'Both are ordered sequences that support indexes and duplicates, but a List can be changed while a Tuple cannot be item-assigned.'
    }
  ]
};
