import { PracticeLesson } from '../../types/practice';

export const practiceLesson022: PracticeLesson = {
  id: '022',
  number: 22,
  title: 'List Methods Part 1',
  questions: [
    {
      id: '022-append-nesting',
      type: 'predict-output',
      prompt: 'What is the last item after appending another List?',
      code: 'friends = ["Ahmed", "Mohamed", "Ali"]\nold_friends = ["Hassan", "Omar", "Khaled"]\nfriends.append(old_friends)\nprint(friends[-1])',
      output: '["Hassan", "Omar", "Khaled"]',
      choices: ['["Hassan", "Omar", "Khaled"]', 'Hassan', 'Omar', '["Ahmed", "Mohamed", "Ali"]'],
      correctAnswer: 0,
      explanation: 'append() adds its argument as one object. Because the argument is a List, that entire List becomes one nested item at the end.'
    },
    {
      id: '022-append-nested-index',
      type: 'predict-output',
      prompt: 'What does the second index access?',
      code: 'friends = ["Ahmed", "Mohamed", "Ali"]\nold_friends = ["Hassan", "Omar", "Khaled"]\nfriends.append(old_friends)\nprint(friends[-1][1])',
      output: 'Omar',
      choices: ['Omar', 'Hassan', 'Khaled', 'Mohamed'],
      correctAnswer: 0,
      explanation: 'friends[-1] is the nested old_friends List, and index 1 inside that List is Omar.'
    },
    {
      id: '022-extend',
      type: 'behavior',
      prompt: 'What is the key difference between append([3, 4]) and extend([3, 4])?',
      choices: ['append adds one nested List; extend adds two separate items', 'They always produce exactly the same List', 'append sorts the values; extend reverses them', 'extend adds the List as one nested item; append spreads it'],
      correctAnswer: 0,
      explanation: 'append() adds one object, while extend() iterates over the given iterable and adds each item separately.'
    },
    {
      id: '022-remove-first',
      type: 'predict-output',
      prompt: 'Which value remains after remove() runs once?',
      code: 'names = ["Ahmed", "Ali", "Ahmed", "Omar"]\nnames.remove("Ahmed")\nprint(names)',
      output: '["Ali", "Ahmed", "Omar"]',
      choices: ['["Ali", "Ahmed", "Omar"]', '["Ahmed", "Ali", "Omar"]', '["Ali", "Omar"]', '[]'],
      correctAnswer: 0,
      explanation: 'remove(value) deletes only the first matching occurrence. The second Ahmed is still in the List.'
    },
    {
      id: '022-sort-none',
      type: 'behavior',
      prompt: 'What should you remember about list.sort()?',
      code: 'nums = [10, 5, 100, -5, 20]\nresult = nums.sort()',
      choices: ['It changes nums in place and result is None', 'It returns a new sorted List and keeps nums unchanged', 'It reverses nums and returns True', 'It removes duplicate values'],
      correctAnswer: 0,
      explanation: 'sort() rearranges the original List and returns None. Use nums.sort() directly; do not expect result to hold the sorted List.'
    },
    {
      id: '022-reverse-vs-sort',
      type: 'predict-output',
      prompt: 'What happens when reverse() flips this current order?',
      code: 'items = [10, 1, "Python", True]\nitems.reverse()\nprint(items)',
      output: '[True, "Python", 1, 10]',
      choices: ['[True, "Python", 1, 10]', '[1, 10, "Python", True]', '[10, 1, "Python", True]', '[True, 1, 10, "Python"]'],
      correctAnswer: 0,
      explanation: 'reverse() flips the current sequence from back to front. It does not compare values or sort them by type or size.'
    }
  ]
};
