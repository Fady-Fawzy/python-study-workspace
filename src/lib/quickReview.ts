import { SyntaxSubsection } from '../types/content';

const PURPOSES_BY_HEADING: Record<string, string> = {
  'append()': 'Adds one value at the end of the List.',
  'extend()': 'Adds each item from an iterable to the List.',
  'remove()': 'Removes the first matching value from the List.',
  'sort()': 'Sorts the List in place; use reverse=True for descending order.',
  'reverse()': 'Reverses the current item order in place; it does not sort.',
  'clear()': 'Removes all items from the same collection.',
  'copy()': 'Creates a shallow copy of the collection.',
  'count()': 'Counts how many times a value appears.',
  'index()': 'Returns the first index where a value appears.',
  'insert()': 'Inserts a value before the given index.',
  'pop()': 'Removes and returns an item; without an index, it removes the last item.',
  'Creating a List': 'Creates an ordered, mutable collection of values.',
  'Access / Index': 'Reads an item by its zero-based index.',
  'Updating an item': 'Replaces one item at a specific index.',
  'Updating a slice': 'Replaces a range of items using slice assignment.',
  'Creating a Tuple': 'Creates an ordered, immutable collection of values.',
  'One-item Tuple': 'Creates a one-value Tuple; the trailing comma is required.',
  'Access': 'Reads an item from the sequence by index.',
  'Immutable Tuple': 'Prevents item assignment after the Tuple is created.',
  'Concatenation': 'Creates a new Tuple by joining two Tuples.',
  'Repeat': 'Creates a new sequence by repeating the original values.',
  'Creating a Set': 'Creates an unordered collection of unique values.',
  'union()': 'Combines the unique values from both Sets.',
  'add()': 'Adds one value to a Set.',
  'discard()': 'Removes a value without raising an error when it is missing.',
  'update()': 'Adds values from another iterable or mapping.',
  'difference()': 'Returns values that exist in the first Set but not the second.',
  'difference_update()': 'Removes the second Set’s values from the first Set in place.',
  'intersection()': 'Returns values shared by both Sets.',
  'intersection_update()': 'Keeps only shared values in the first Set.',
  'symmetric_difference()': 'Returns values that are in either Set, but not both.',
  'symmetric_difference_update()': 'Keeps only non-shared values in the first Set.',
  'issuperset()': 'Checks whether the first Set contains every value in the second.',
  'issubset()': 'Checks whether every value in the first Set exists in the second.',
  'isdisjoint()': 'Checks whether two Sets have no values in common.',
  'Creating a Dictionary': 'Creates a key-value collection for named access.',
  'Difference between [] and get()': 'Compares strict key access with safe lookup for missing keys.',
  'Nested Dictionary': 'Stores dictionaries inside other dictionaries for grouped data.',
  'keys()': 'Returns a view of the Dictionary keys.',
  'values()': 'Returns a view of the Dictionary values.',
  'items()': 'Returns key-value pairs from the Dictionary.',
  'setdefault()': 'Returns a key’s value and adds a default when the key is missing.',
  'popitem()': 'Removes and returns the last inserted key-value pair.',
  'fromkeys()': 'Builds a Dictionary from keys and one shared default value.',
  'bool()': 'Converts a value to its Boolean truth value.',
  'Usually Truthy': 'Shows values that normally evaluate to True.',
  'Usually Falsy': 'Shows values that normally evaluate to False.',
  'To String': 'Converts a value to a String.',
  'To Integer': 'Converts a value to an Integer.',
  'To Float': 'Converts a value to a Float.',
  'To List': 'Converts an iterable to a List.',
  'To Tuple': 'Converts an iterable to a Tuple.',
  'To Set': 'Converts an iterable to a Set of unique values.',
  'Basic Input': 'Reads text entered by the user.',
  'Input + Conversion': 'Reads input and converts it to the required type.',
  'Input + Cleaning': 'Reads input and removes unwanted surrounding whitespace.',
  'strip()': 'Removes whitespace from both ends of a String.',
  'lower()': 'Returns a lowercase version of a String.',
  'upper()': 'Returns an uppercase version of a String.',
  'capitalize()': 'Returns a String with its first character capitalized.',
  'Membership Operators': 'Checks whether a value exists inside a collection.',
  'break': 'Stops the current loop immediately.',
  'continue': 'Skips to the next loop iteration.',
  'pass': 'Keeps an empty block syntactically valid without doing anything.'
};

function extractMeaningfulComments(subsection: SyntaxSubsection): string[] {
  const comments = subsection.codeBlocks.flatMap(block =>
    block.code.split('\n').flatMap(line => {
      const comment = line.match(/#\s*(.+)$/)?.[1]?.trim();
      return comment ? [comment] : [];
    })
  );

  return Array.from(new Set(comments.filter(comment =>
    comment.length > 1 &&
    !/^-?\d+(?:\.\d+)?$/.test(comment) &&
    !/^(?:TypeError|KeyError)$/.test(comment)
  )));
}

export function getQuickReviewPurpose(subsection: SyntaxSubsection): string {
  const heading = subsection.heading.trim();
  const knownPurpose = PURPOSES_BY_HEADING[heading];

  if (knownPurpose) return knownPurpose;

  const comments = extractMeaningfulComments(subsection);
  if (comments.length > 0) return comments.join(' · ');

  if (!heading) return 'Keep these patterns nearby as a syntax reminder.';
  if (/^example(?:s)?$/i.test(heading)) return 'Shows the pattern in a small example.';
  if (/^creating a /i.test(heading)) return `Use this pattern to ${heading.toLowerCase()}.`;
  if (/^access/i.test(heading)) return 'Reads a value from the sequence using its position.';
  if (/^updating/i.test(heading)) return 'Changes existing data using the pattern below.';
  if (/^to /i.test(heading)) return `Use this pattern to ${heading.toLowerCase()}.`;
  if (/\(\)$/.test(heading)) return `Use ${heading} with the current value or collection.`;

  return 'Use this pattern as a quick syntax reminder.';
}
