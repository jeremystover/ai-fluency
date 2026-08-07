// Shared between the worker and the SPA: the tutor ends every reply with a
// `<paths>a|b|c</paths>` trailer; this splits it into display text + chips.
export function extractPaths(raw: string): { body: string; options: string[] } {
  const match = raw.match(/<paths>([\s\S]*?)<\/paths>\s*$/);
  if (!match) return { body: raw.trim(), options: [] };
  const options = match[1]
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
  return { body: raw.slice(0, match.index).trim(), options };
}
