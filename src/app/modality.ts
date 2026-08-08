// Turns the learner's stated learning styles into an actual surface choice —
// the promise of the intake is that answers change the platform, so the first
// style they picked (that we can serve) decides where a module starts.
import type { MeResponse } from '../shared/types';

export type Surface = 'read' | 'chat' | 'voice-chat' | 'podcast';

// Selection order in the intake is preserved in prefs.styles, so the first
// servable style wins. 'reading' is an explicit vote for the default.
export function preferredSurface(styles: string[] | undefined): Surface {
  for (const s of styles ?? []) {
    if (s === 'reading') return 'read';
    if (s === 'interactive') return 'chat';
    if (s === 'voice') return 'voice-chat';
    if (s === 'podcast') return 'podcast';
  }
  return 'read';
}

export function surfaceRoute(surface: Surface): string {
  switch (surface) {
    case 'chat':
      return '/module/1/chat';
    case 'voice-chat':
      return '/module/1/chat?voice=1';
    case 'podcast':
      return '/module/1/podcast';
    default:
      return '/module/1';
  }
}

export function surfaceStartLabel(surface: Surface): string {
  switch (surface) {
    case 'chat':
      return 'Start with the tutor →';
    case 'voice-chat':
      return 'Start talking →';
    case 'podcast':
      return 'Start with a podcast →';
    default:
      return 'Start →';
  }
}

// First visit to a module with a non-reading preference and that surface
// untouched → take them straight there. Once they've used it (or if they
// chose reading) the module view is home base and never bounces them.
export function firstVisitRedirect(me: MeResponse | null): string | null {
  if (!me?.authenticated) return null;
  const surface = preferredSurface(me.prefs?.styles);
  if ((surface === 'chat' || surface === 'voice-chat') && !me.progress.chatStarted) return surfaceRoute(surface);
  if (surface === 'podcast' && !me.progress.podcastTried) return surfaceRoute(surface);
  return null;
}
