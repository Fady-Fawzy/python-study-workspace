#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { validatePracticeDraft } from './practiceDraft.mjs';

const SUPPORTED_LESSONS = new Set(['020', '021', '022', '023', '024', '025']);
const lessonId = process.argv[2];
const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const fail = (message) => {
  throw new Error(message);
};

const extractJsonText = (payload) => {
  const text = payload?.candidates?.[0]?.content?.parts
    ?.map(part => part?.text || '')
    .join('')
    .trim();

  if (!text) fail('Gemini returned no draft text');

  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
};

const buildPrompt = (id, source) => `You are helping author a static Python study website.
Create a reviewable practice-question draft for lesson ${id} using only the repository-owned lesson context below.
Return JSON only. Do not include Markdown fences or commentary.

Required JSON shape:
{
  "lessonId": "${id}",
  "questions": [
    {
      "id": "${id}-unique-slug",
      "type": "multiple-choice | predict-output | behavior",
      "prompt": "clear English question",
      "code": "optional Python snippet",
      "output": "optional deterministic output or error label",
      "choices": ["at least two options"],
      "correctAnswer": 0,
      "explanation": "why the answer is correct"
    }
  ]
}

Rules:
- Keep questions focused on this lesson's concepts.
- Never execute Python or invent environment-dependent output.
- Prefer deterministic examples and explain the reasoning.
- Do not use external or proprietary material.

Repository lesson context:
---
${source}
---`;

const run = async () => {
  if (!SUPPORTED_LESSONS.has(lessonId)) {
    fail('Usage: GEMINI_API_KEY=... npm run practice:draft -- 020 (supported: 020-025)');
  }
  if (!apiKey) {
    fail('GEMINI_API_KEY is required in the local environment; it is never read from the browser bundle.');
  }

  const sourcePath = resolve(process.cwd(), 'src/content/detailed', `${lessonId}.md`);
  const source = await readFile(sourcePath, 'utf8');
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: buildPrompt(lessonId, source) }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with HTTP ${response.status}`);
  }

  const payload = await response.json();
  const draft = validatePracticeDraft(JSON.parse(extractJsonText(payload)), lessonId);
  const outputDirectory = resolve(process.cwd(), 'tmp/practice-drafts');
  const outputPath = resolve(outputDirectory, `${lessonId}.json`);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(draft, null, 2)}\n`, 'utf8');
  console.log(`Practice draft written to ${relative(process.cwd(), outputPath)}`);
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Failed to generate practice draft');
  process.exitCode = 1;
});
