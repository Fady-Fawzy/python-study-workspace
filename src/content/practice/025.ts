import { PracticeLesson } from '../../types/practice';

export const practiceLesson025: PracticeLesson = {
  id: '025',
  number: 25,
  title: 'Tuples And Methods Part 2',
  questions: [
    {
      id: '025-single-item',
      type: 'behavior',
      prompt: 'Which expression creates a one-item Tuple?',
      choices: ['("Python",)', '("Python")', '["Python"]', '{"Python"}'],
      correctAnswer: 0,
      explanation: 'A one-item Tuple requires a trailing comma. ("Python") is just a string in parentheses, while ("Python",) is a Tuple.'
    },
    {
      id: '025-single-item-type',
      type: 'predict-output',
      prompt: 'What does len() return for this one-item Tuple?',
      code: 'value = "Python",\nprint(len(value))',
      output: '1',
      choices: ['1', '6', '0', '7'],
      correctAnswer: 0,
      explanation: 'The comma makes value a Tuple containing one string. len() counts Tuple items, so the length is 1, not the number of letters.'
    },
    {
      id: '025-concatenation',
      type: 'predict-output',
      prompt: 'What new Tuple is created by concatenation?',
      code: 'a = (1, 2, 3)\nb = (4, 5)\nc = a + b\nprint(c)',
      output: '(1, 2, 3, 4, 5)',
      choices: ['(1, 2, 3, 4, 5)', '(5, 4, 3, 2, 1)', '[1, 2, 3, 4, 5]', '(1, 2, 3)'],
      correctAnswer: 0,
      explanation: 'The + operator joins the sequences and creates a new Tuple. The original a and b remain unchanged.'
    },
    {
      id: '025-repeat',
      type: 'predict-output',
      prompt: 'What does repeating a Tuple with * produce?',
      code: 'values = (1, 2) * 3\nprint(values)',
      output: '(1, 2, 1, 2, 1, 2)',
      choices: ['(1, 2, 1, 2, 1, 2)', '(3, 6)', '[1, 2, 3]', '(1, 2)'],
      correctAnswer: 0,
      explanation: 'Sequence repetition repeats the complete Tuple three times and returns a new Tuple.'
    },
    {
      id: '025-count',
      type: 'predict-output',
      prompt: 'How many times does count(8) return?',
      code: 'values = (1, 3, 7, 8, 2, 8, 8)\nprint(values.count(8))',
      output: '3',
      choices: ['3', '2', '8', '1'],
      correctAnswer: 0,
      explanation: 'count() scans the Tuple and counts matches. The value 8 appears at three positions.'
    },
    {
      id: '025-index',
      type: 'predict-output',
      prompt: 'What zero-based index does index(30) return?',
      code: 'values = (10, 20, 30, 40)\nprint(values.index(30))',
      output: '2',
      choices: ['2', '3', '30', '1'],
      correctAnswer: 0,
      explanation: 'index() returns the position of the value. In a zero-based Tuple, 10 is 0, 20 is 1, and 30 is 2.'
    },
    {
      id: '025-unpacking',
      type: 'behavior',
      prompt: 'How are these variables assigned during unpacking?',
      code: 'person = ("Ahmed", 25, "Egypt")\nname, age, country = person',
      choices: ['name gets Ahmed, age gets 25, country gets Egypt', 'Every variable gets the whole Tuple', 'name gets 25, age gets Egypt, country gets Ahmed', 'Only name receives a value'],
      correctAnswer: 0,
      explanation: 'Unpacking maps values by position from left to right. The number of target variables normally needs to match the number of Tuple items.'
    },
    {
      id: '025-underscore',
      type: 'behavior',
      prompt: 'What does the underscore mean in this unpacking statement?',
      code: 'name, _, country = ("Ahmed", 25, "Egypt")',
      choices: ['The middle value is received but intentionally ignored', 'The middle value is deleted from the Tuple', 'The underscore makes the Tuple mutable', 'The statement skips the middle value without assigning it'],
      correctAnswer: 0,
      explanation: 'An underscore is conventionally used for a value the code does not need. It is still a normal variable name and receives 25.'
    }
  ]
};
