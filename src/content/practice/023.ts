import { PracticeLesson } from '../../types/practice';

export const practiceLesson023: PracticeLesson = {
  id: '023',
  number: 23,
  title: 'List Methods Part 2',
  questions: [
    {
      id: '023-clear',
      type: 'predict-output',
      prompt: 'What does clear() leave in the same List?',
      code: 'numbers = [1, 2, 3]\nnumbers.clear()\nprint(numbers)',
      output: '[]',
      choices: ['[]', '[1, 2, 3]', 'None', '[0]'],
      correctAnswer: 0,
      explanation: 'clear() removes every item from the existing List. The List object remains available, but it is now empty.'
    },
    {
      id: '023-copy-independent',
      type: 'predict-output',
      prompt: 'What does copied contain after original changes?',
      code: 'original = [1, 2, 3, 4]\ncopied = original.copy()\noriginal.append(5)\nprint(copied)',
      output: '[1, 2, 3, 4]',
      choices: ['[1, 2, 3, 4]', '[1, 2, 3, 4, 5]', '[5]', 'None'],
      correctAnswer: 0,
      explanation: 'copy() creates a separate top-level List. Adding 5 to original does not add it to copied.'
    },
    {
      id: '023-count',
      type: 'predict-output',
      prompt: 'How many times does count() find 1?',
      code: 'print([1, 2, 1, 3, 1, 5].count(1))',
      output: '3',
      choices: ['3', '1', '2', '5'],
      correctAnswer: 0,
      explanation: 'count(value) checks the whole List and returns the number of matching items. The value 1 appears three times.'
    },
    {
      id: '023-index',
      type: 'predict-output',
      prompt: 'What index does index() return for Omar?',
      code: 'names = ["Ahmed", "Ali", "Omar", "Khaled"]\nprint(names.index("Omar"))',
      output: '2',
      choices: ['2', '1', '3', '0'],
      correctAnswer: 0,
      explanation: 'Lists use zero-based indexing: Ahmed is 0, Ali is 1, and Omar is 2. A missing value would raise ValueError.'
    },
    {
      id: '023-insert-negative',
      type: 'predict-output',
      prompt: 'Where is Test inserted by insert(-1, ...)?',
      code: 'items = ["A", "B", "C", "D"]\nitems.insert(-1, "Test")\nprint(items)',
      output: '["A", "B", "C", "Test", "D"]',
      choices: ['["A", "B", "C", "Test", "D"]', '["A", "B", "C", "D", "Test"]', '["Test", "A", "B", "C", "D"]', '["A", "Test", "B", "C", "D"]'],
      correctAnswer: 0,
      explanation: 'Index -1 points to the current last item D. insert() places the new value before that position, so Test comes before D.'
    },
    {
      id: '023-pop-return',
      type: 'predict-output',
      prompt: 'What are deleted_item and items after pop(2)?',
      code: 'items = ["A", "B", "C", "D"]\ndeleted_item = items.pop(2)\nprint(deleted_item)\nprint(items)',
      output: 'C\n["A", "B", "D"]',
      choices: ['C and ["A", "B", "D"]', '2 and ["A", "B", "C", "D"]', 'D and ["A", "B", "C"]', 'None and ["A", "B", "D"]'],
      correctAnswer: 0,
      explanation: 'pop(index) removes the item at that position and returns it. Index 2 is C, leaving A, B, and D in the List.'
    }
  ]
};
