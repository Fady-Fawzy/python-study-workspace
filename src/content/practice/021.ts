import { PracticeLesson } from '../../types/practice';

export const practiceLesson021: PracticeLesson = {
  id: '021',
  number: 21,
  title: 'Lists',
  questions: [
    {
      id: '021-list-model',
      type: 'multiple-choice',
      prompt: 'Which description best matches a Python List?',
      choices: ['An ordered, mutable sequence', 'An unordered, immutable sequence', 'A sequence that rejects duplicate values', 'A sequence that can contain only strings'],
      correctAnswer: 0,
      explanation: 'A List keeps item order, can be changed after creation, allows duplicates, and can contain values of different types.'
    },
    {
      id: '021-positive-index',
      type: 'predict-output',
      prompt: 'What does index 1 select?',
      code: 'my_list = ["Python", "HTML", "Python", 10, 50.5, True]\nprint(my_list[1])',
      output: 'HTML',
      choices: ['HTML', 'Python', '10', 'True'],
      correctAnswer: 0,
      explanation: 'List indexes start at 0, so index 0 is the first Python and index 1 is the following item, HTML.'
    },
    {
      id: '021-negative-index',
      type: 'predict-output',
      prompt: 'What does the negative index -3 select?',
      code: 'my_list = ["Python", "HTML", "Python", 10, 50.5, True]\nprint(my_list[-3])',
      output: '10',
      choices: ['10', 'Python', '50.5', 'True'],
      correctAnswer: 0,
      explanation: 'Negative indexes count from the end: -1 is True, -2 is 50.5, and -3 is 10.'
    },
    {
      id: '021-slice-stop',
      type: 'predict-output',
      prompt: 'What is the value of this slice?',
      code: 'my_list = ["Python", "HTML", "Python", 10, 50.5, True]\nprint(my_list[1:4])',
      output: '["HTML", "Python", 10]',
      choices: ['["HTML", "Python", 10]', '["Python", "HTML", "Python", 10]', '["HTML", "Python", 10, 50.5]', '["Python", 10]'],
      correctAnswer: 0,
      explanation: 'The start index is included and the stop index is excluded. Python takes indexes 1, 2, and 3, but not index 4.'
    },
    {
      id: '021-step',
      type: 'predict-output',
      prompt: 'What does a step of 2 do in this slice?',
      code: 'values = [0, 1, 2, 3, 4, 5]\nprint(values[::2])',
      output: '[0, 2, 4]',
      choices: ['[0, 2, 4]', '[1, 3, 5]', '[0, 1]', '[2, 4, 5]'],
      correctAnswer: 0,
      explanation: 'The step tells Python how far to move between selected indexes. A step of 2 takes every second item, starting at index 0.'
    },
    {
      id: '021-slice-replace',
      type: 'behavior',
      prompt: 'What happens when a slice is assigned a new List?',
      code: 'items = ["Python", "HTML", "CSS"]\nitems[0:2] = ["JavaScript", "PHP"]',
      choices: ['The first two items are replaced', 'A nested List is added at index 0', 'The original List becomes immutable', 'Only the item at index 2 changes'],
      correctAnswer: 0,
      explanation: 'Slice assignment replaces the selected range. The List stays mutable, and the first two values become JavaScript and PHP.'
    }
  ]
};
