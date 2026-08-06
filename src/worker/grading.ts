// Worker-side grading against the Anthropic API. The key never reaches the client.
import rubric from '../../content/rubric.json';
import type { RubricDimension } from '../shared/types';

export const PROMPT_VERSION = rubric.promptVersion;

export type ParsedGrade = { dimensions: RubricDimension[]; total: number; summary: string };

function buildSystemPrompt(): string {
  const dims = rubric.dimensions.map((d, i) => `${i + 1}. **${d.name}** (0–5): ${d.criteria}`).join('\n');
  return [
    'You are grading a learner submission for "Testing the Edges", the applied activity in Module 1 of an AI fluency course for People leaders.',
    'The submission should contain accounts of three conversations with an AI tool (where it\'s strong; where it might fabricate; where it can\'t know) and a 250–350 word reflection.',
    '',
    'Score each rubric dimension from 0 to 5 (integers):',
    dims,
    '',
    'Important: the Calibration dimension is scored on honesty and specificity, not accuracy. A learner whose prediction was badly wrong but who states the prediction, the outcome, and the direction of error plainly should score highly. Never penalize a wrong prediction; penalize only a missing, vague, or evasive one.',
    'Comments are 1–2 sentences each, written directly to the learner in second person, specific to what they wrote. Plain verbs, no praise inflation.',
    'The summary is 2–3 sentences: what the submission shows about their current mental model, and the one thing to push on next.',
    '',
    'Respond with strict JSON only — no markdown, no code fences, no text outside the JSON. Shape:',
    '{"dimensions":[{"name":"<dimension name>","score":<0-5>,"comment":"<string>"}],"total":<0-20>,"summary":"<string>"}',
    'Include all four dimensions in rubric order. "total" must equal the sum of the four scores.',
  ].join('\n');
}

function parseGrade(text: string): ParsedGrade | null {
  let raw = text.trim();
  // Strip code fences if the model added them despite instructions.
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const obj = parsed as Record<string, unknown>;
  if (!Array.isArray(obj.dimensions) || obj.dimensions.length !== rubric.dimensions.length) return null;
  const dimensions: RubricDimension[] = [];
  for (let i = 0; i < rubric.dimensions.length; i++) {
    const d = obj.dimensions[i] as Record<string, unknown>;
    if (typeof d !== 'object' || d === null) return null;
    const score = Number(d.score);
    if (!Number.isFinite(score) || score < 0 || score > 5) return null;
    if (typeof d.comment !== 'string') return null;
    dimensions.push({ name: rubric.dimensions[i].name, score: Math.round(score), comment: d.comment });
  }
  const total = dimensions.reduce((sum, d) => sum + d.score, 0);
  const summary = typeof obj.summary === 'string' ? obj.summary : '';
  return { dimensions, total, summary };
}

async function callOnce(apiKey: string, model: string, body: string, predictedPct: number | null): Promise<string | null> {
  const userContent = [
    predictedPct !== null ? `The learner's Conversation 2 prediction, captured before they ran it: ${predictedPct}% likely to contain something invented.` : null,
    'Submission:',
    '<submission>',
    body,
    '</submission>',
  ]
    .filter(Boolean)
    .join('\n\n');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1200,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: userContent }],
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = data.content?.find((c) => c.type === 'text')?.text;
  return text ?? null;
}

// One retry, then null — the caller degrades gracefully and never loses the submission.
export async function gradeSubmission(
  apiKey: string,
  model: string,
  body: string,
  predictedPct: number | null,
): Promise<ParsedGrade | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const text = await callOnce(apiKey, model, body, predictedPct);
      if (text) {
        const grade = parseGrade(text);
        if (grade) return grade;
      }
    } catch {
      // fall through to retry
    }
  }
  return null;
}
