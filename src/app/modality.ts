// Turns the learner's stated learning styles into an actual surface choice —
// the promise of the intake is that answers change the platform, so the first
// style they picked (that we can serve) decides where a module starts.
import type { MeResponse } from '../shared/types';
import { preferredSurface, type Surface } from '../shared/modality';

export { preferredSurface, type Surface };

export function surfaceRoute(surface: Surface, moduleId = 'ai101-m1'): string {
  switch (surface) {
    case 'chat':
      return `/module/${moduleId}/chat`;
    case 'voice-chat':
      return `/module/${moduleId}/chat?voice=1`;
    case 'quiz':
      return `/module/${moduleId}/check`;
    case 'podcast':
      // The module page IS the podcast home for podcast-first learners.
      return `/module/${moduleId}`;
    default:
      return `/module/${moduleId}`;
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
    case 'quiz':
      return 'Take the quiz →';
    default:
      return 'Start →';
  }
}

// First visit to a module with a chat preference and that surface untouched →
// take them straight to the tutor. Podcast-first learners stay: the module
// page is their podcast home. Once used (or for readers), it never bounces.
export function firstVisitRedirect(me: MeResponse | null, moduleId = 'ai101-m1'): string | null {
  if (!me?.authenticated) return null;
  const surface = preferredSurface(me.prefs?.styles);
  if ((surface === 'chat' || surface === 'voice-chat') && !me.progress.chatStarted) return surfaceRoute(surface, moduleId);
  return null;
}
