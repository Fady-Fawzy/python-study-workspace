import { PracticeLesson } from '../../types/practice';

export const practiceLesson020: PracticeLesson = {
  id: '020',
  number: 20,
  title: 'Arithmetic Operators',
  questions: [
    {
      id: '020-precedence',
      type: 'predict-output',
      prompt: 'What does this expression print?',
      code: 'print(5 + 10 * 20)',
      output: '205',
      choices: ['205', '300', '250', '150'],
      correctAnswer: 0,
      explanation: 'Multiplication has higher precedence than addition, so Python evaluates 10 * 20 first and then adds 5: 5 + 200 = 205.'
    },
    {
      id: '020-true-division',
      type: 'predict-output',
      prompt: 'What is the exact output of true division here?',
      code: 'print(100 / 20)',
      output: '5.0',
      choices: ['5.0', '5', '20.0', '100'],
      correctAnswer: 0,
      explanation: 'The / operator performs true division and returns a float in Python, even when the result has no fractional part.'
    },
    {
      id: '020-modulus',
      type: 'predict-output',
      prompt: 'What remainder does this expression produce?',
      code: 'print(9 % 2)',
      output: '1',
      choices: ['1', '0', '4', '4.5'],
      correctAnswer: 0,
      explanation: 'The modulus operator returns the remainder after division. 9 divided by 2 leaves a remainder of 1, which is why it is useful for checking odd and even values.'
    },
    {
      id: '020-power',
      type: 'predict-output',
      prompt: 'What does exponentiation calculate in this example?',
      code: 'print(2 ** 5)',
      output: '32',
      choices: ['32', '10', '25', '64'],
      correctAnswer: 0,
      explanation: 'The ** operator raises the first number to the power of the second: 2 × 2 × 2 × 2 × 2 = 32.'
    },
    {
      id: '020-floor-division',
      type: 'predict-output',
      prompt: 'What is the result of floor division?',
      code: 'print(119 // 20)',
      output: '5',
      choices: ['5', '5.95', '6', '99'],
      correctAnswer: 0,
      explanation: '119 / 20 is 5.95. The // operator floors the result to the whole-number direction, giving 5 for these positive values.'
    },
    {
      id: '020-parentheses',
      type: 'behavior',
      prompt: 'Why does adding parentheses change this result?',
      code: 'print((5 + 10) * 20)\n# 300',
      choices: ['Parentheses force addition before multiplication', 'Parentheses turn every number into a float', 'Parentheses reverse the final answer', 'Parentheses disable operator precedence'],
      correctAnswer: 0,
      explanation: 'Parentheses have priority, so Python calculates 5 + 10 first and then multiplies the result by 20: 15 * 20 = 300.'
    }
  ]
};
