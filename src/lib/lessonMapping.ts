// Explicit, deterministic mapping from lesson number to syntax reference section IDs (1..67)
export const LESSON_TO_SYNTAX_MAP: Record<number, number[]> = {
  20: [1],                                // Arithmetic Operators
  21: [2],                                // Lists
  22: [3],                                // Lists Methods Part 1
  23: [3],                                // Lists Methods Part 2
  24: [4],                                // Tuples And Methods Part 1
  25: [4],                                // Tuples And Methods Part 2
  26: [5],                                // Set
  27: [5, 6],                             // Set Methods Part 1
  28: [6],                                // Set Methods Part 2
  29: [6],                                // Set Methods Part 3
  30: [7],                                // Dictionary
  31: [8],                                // Dictionary Methods Part 1
  32: [8],                                // Dictionary Methods Part 2
  33: [9],                                // Boolean
  34: [10],                               // Boolean Operators
  35: [11],                               // Assignment Operators
  36: [12],                               // Comparison Operators
  37: [13],                               // Type Conversion
  38: [14, 15],                           // User Input & String processing
  39: [2, 14, 15],                        // Practical Email Slice
  40: [1, 13, 14],                        // Practical Age Details
  41: [16, 17],                           // If, Elif, Else, Indentation
  42: [18],                               // Nested If
  43: [19],                               // Ternary Conditional
  44: [16, 17, 18, 19],                   // Calculate Age Advanced
  45: [20],                               // Membership Operators
  46: [20, 16],                           // Practical Membership Control
  47: [21],                               // While Loop And Else
  48: [21],                               // While Trainings
  49: [2, 21],                            // Bookmark Manager
  50: [21],                               // Password Guess
  51: [22],                               // For Loop And Else
  52: [22],                               // For Loop Trainings
  53: [23],                               // Nested For Loop
  54: [24],                               // Break, Continue, Pass
  55: [25],                               // Loop Advanced Dictionary
  56: [26, 27],                           // Function And Return
  57: [28],                               // Function Parameters And Arguments
  58: [30, 31],                           // Packing & Unpacking Arguments
  59: [29],                               // Function Default Parameters
  60: [32, 33],                           // Packing & Unpacking Keyword Arguments
  61: [30, 31, 32, 33, 34],               // Packing & Unpacking Trainings
  62: [35],                               // Function Scope
  63: [36],                               // Function Recursion
  64: [37],                               // Lambda Function
  65: [38],                               // Files Handling Part 1 — Intro
  66: [39, 42],                           // Read Files, File Cursor
  67: [40, 41],                           // Write And Append
  68: [42, 43],                           // File Cursor, os.remove
  69: [44, 45, 46, 47, 48, 49, 50, 51],   // Built-ins 1 (all, any, bin, id, sum, round, range, print)
  70: [52, 53, 54, 55],                   // Built-ins 2 (abs, pow, min, max)
  71: [56],                               // Built-ins 3 (slice)
  72: [57, 60],                           // Built-ins 4 — Map & Comparison
  73: [58, 60],                           // Built-ins 5 — Filter & Comparison
  74: [59, 60]                            // Built-ins 6 — Reduce & Comparison
};

export const LESSON_CATEGORIES = [
  {
    name: "Operators & Expressions",
    range: [20, 20],
    description: "Arithmetic, precedence, modulo, exponentiation"
  },
  {
    name: "Lists & Operations",
    range: [21, 23],
    description: "Creation, slicing, mutable operations, and 11 essential methods"
  },
  {
    name: "Tuples",
    range: [24, 25],
    description: "Immutability, packing/unpacking, indexing, and concatenation"
  },
  {
    name: "Sets & Operations",
    range: [26, 29],
    description: "Unordered uniqueness, union, intersection, difference, and subsets"
  },
  {
    name: "Dictionaries",
    range: [30, 32],
    description: "Key-value mapping, nested dicts, update, get, keys, items, values"
  },
  {
    name: "Booleans & Logic",
    range: [33, 37],
    description: "Truth values, and/or/not, comparison, assignment, type casting"
  },
  {
    name: "User Input & Applications",
    range: [38, 40],
    description: "Interactive input, type validation, email slicer, age calculator"
  },
  {
    name: "Control Flow & Conditions",
    range: [41, 46],
    description: "if/elif/else, ternary operator, membership in/not in, practice"
  },
  {
    name: "While Loops",
    range: [47, 50],
    description: "Condition loops, else clause, bookmark manager, password game"
  },
  {
    name: "For Loops & Iteration",
    range: [51, 55],
    description: "Sequence iteration, range(), nested loops, break, continue, pass, dict loops"
  },
  {
    name: "Functions & Scope",
    range: [56, 64],
    description: "def, return, *args, **kwargs, defaults, LEGB scope, recursion, lambda"
  },
  {
    name: "File Handling",
    range: [65, 68],
    description: "open modes, read/write/append, seek/tell cursor, os.remove"
  },
  {
    name: "Built-In & Functional Tools",
    range: [69, 74],
    description: "Core utility functions, map, filter, functools.reduce"
  }
];

export function getCategoryForLesson(lessonNumber: number): string {
  for (const cat of LESSON_CATEGORIES) {
    if (lessonNumber >= cat.range[0] && lessonNumber <= cat.range[1]) {
      return cat.name;
    }
  }
  return "General";
}

export const SYNTAX_CATEGORIES: { name: string; sectionIds: number[]; description: string }[] = [
  {
    name: "Operators & Expressions",
    sectionIds: [1, 10, 11, 12, 20],
    description: "Arithmetic, Boolean logic, Assignment, Comparison, Membership"
  },
  {
    name: "Data Structures",
    sectionIds: [2, 3, 4, 5, 6, 7, 8, 9],
    description: "Lists, Tuples, Sets, Dictionaries, and their complete built-in methods"
  },
  {
    name: "Input & Type Conversion",
    sectionIds: [13, 14, 15],
    description: "Type casting, input(), string methods applied in study"
  },
  {
    name: "Control Flow",
    sectionIds: [16, 17, 18, 19],
    description: "If, Elif, Else, Indentation rules, Nested conditions, Ternary"
  },
  {
    name: "Loops & Iteration",
    sectionIds: [21, 22, 23, 24, 25],
    description: "While, For, Nested loops, Break/Continue/Pass, Looping over Dictionaries"
  },
  {
    name: "Functions & Scope",
    sectionIds: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
    description: "Parameters, return, *args, **kwargs, Scope, Recursion, Lambda"
  },
  {
    name: "File Handling",
    sectionIds: [38, 39, 40, 41, 42, 43],
    description: "open(), read, write, append, cursor control (seek/tell), os.remove"
  },
  {
    name: "Built-In Functions",
    sectionIds: [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56],
    description: "all, any, bin, id, sum, round, range, print(), abs, pow, min, max, slice"
  },
  {
    name: "Functional Tools",
    sectionIds: [57, 58, 59, 60],
    description: "map(), filter(), reduce(), and comparison guide"
  },
  {
    name: "Patterns, Pitfalls & Mental Models",
    sectionIds: [61, 62, 63, 64, 65, 66, 67],
    description: "Essential study patterns, common gotchas, cheat sheet, mental models"
  }
];

export function getCategoryForSyntaxSection(sectionId: number): string {
  for (const cat of SYNTAX_CATEGORIES) {
    if (cat.sectionIds.includes(sectionId)) {
      return cat.name;
    }
  }
  return "General";
}
