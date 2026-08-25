const SUPPORTED_TYPES = new Set(['multiple-choice', 'predict-output', 'behavior']);

const isRecord = (value) => (
  value !== null
  && typeof value === 'object'
  && !Array.isArray(value)
);

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

export function validatePracticeDraft(candidate, expectedLessonId) {
  if (!isRecord(candidate)) {
    throw new Error('Gemini draft must be a JSON object');
  }
  if (candidate.lessonId !== expectedLessonId) {
    throw new Error(`Draft lesson ID must be ${expectedLessonId}`);
  }
  if (!Array.isArray(candidate.questions) || candidate.questions.length === 0) {
    throw new Error('Gemini draft must contain at least one question');
  }

  const seenIds = new Set();
  const questions = candidate.questions.map((question, index) => {
    if (!isRecord(question)) {
      throw new Error(`Question ${index + 1} must be an object`);
    }
    if (!isNonEmptyString(question.id) || seenIds.has(question.id)) {
      throw new Error(`Duplicate or missing question ID at question ${index + 1}`);
    }
    seenIds.add(question.id);
    if (!SUPPORTED_TYPES.has(question.type)) {
      throw new Error(`Unsupported question type at question ${index + 1}`);
    }
    if (!isNonEmptyString(question.prompt) || !isNonEmptyString(question.explanation)) {
      throw new Error(`Question ${question.id} needs prompt and explanation`);
    }
    if (!Array.isArray(question.choices) || question.choices.length < 2
      || question.choices.some(choice => !isNonEmptyString(choice))) {
      throw new Error(`Question ${question.id} needs at least two non-empty choices`);
    }
    if (!Number.isInteger(question.correctAnswer)
      || question.correctAnswer < 0
      || question.correctAnswer >= question.choices.length) {
      throw new Error(`Invalid correct answer for question ${question.id}`);
    }
    if (question.code !== undefined && !isNonEmptyString(question.code)) {
      throw new Error(`Question ${question.id} has empty code`);
    }
    if (question.output !== undefined && !isNonEmptyString(question.output)) {
      throw new Error(`Question ${question.id} has empty output`);
    }

    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      ...(question.code === undefined ? {} : { code: question.code }),
      ...(question.output === undefined ? {} : { output: question.output }),
      choices: [...question.choices],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    };
  });

  return { lessonId: expectedLessonId, questions };
}
