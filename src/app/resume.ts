// Where a half-finished module resumes — the surface the last touch came
// from, so "pick up where you left off" lands on the thing they were actually
// doing. Shared by the path's hero and the library's in-progress cards.
import type { PathResume } from '../shared/types';

export const resumeRoute = (r: PathResume): string => {
  const base = `/module/${r.moduleId}`;
  switch (r.via) {
    case 'chat':
      return `${base}/chat`;
    case 'podcast':
      return `${base}/podcast`;
    case 'check':
      return `${base}/check`;
    case 'activity':
      return `${base}/activity`;
    default:
      return base;
  }
};

export const resumeLabel = (r: PathResume): string => {
  switch (r.via) {
    case 'chat':
      return 'Back to the tutor →';
    case 'podcast':
      return 'Back to the episode →';
    case 'check':
      return 'Back to the check →';
    case 'activity':
      return 'Back to the activity →';
    case 'exercise':
      return 'Back to the exercise →';
    default:
      return 'Keep reading →';
  }
};
