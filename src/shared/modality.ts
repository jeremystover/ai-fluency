// The learner's preferred learning surface, derived from prefs.styles.
// Selection order in the intake is preserved, so the first servable style
// wins; 'reading' is an explicit vote for the default. Shared because both
// the SPA (routing, layout) and the worker (podcast pregeneration) key off it.
export type Surface = 'read' | 'chat' | 'voice-chat' | 'podcast';

export function preferredSurface(styles: string[] | undefined): Surface {
  for (const s of styles ?? []) {
    if (s === 'reading') return 'read';
    if (s === 'interactive') return 'chat';
    if (s === 'voice') return 'voice-chat';
    if (s === 'podcast') return 'podcast';
  }
  return 'read';
}
