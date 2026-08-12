// The People roles the 301 tracks are built for. Asked at intake as a single
// pick, because a role has to resolve to exactly one specialist track and
// free text can't do that reliably — "People Partner", "HRBP", and "Sr. HR
// Business Partner" are the same track and no string match should have to
// know it.
//
// `track` is the course id this role should see at 301. Roles whose track
// isn't authored yet point at the HRBP track, which is the foundation of the
// specialist ladder — the resolver below falls back the same way for anything
// unrecognized, so a missing track degrades to a real course rather than an
// empty path.

export type RoleChoice = {
  id: string;
  label: string; // also the display string stored as roleLabel when no free text is given
  detail: string;
  track: string;
};

export const DEFAULT_TRACK = 'ai301-hrbp';

export const ROLE_CHOICES: RoleChoice[] = [
  {
    id: 'hrbp',
    label: 'HR Business Partner',
    detail: 'Aligned to a business unit — advising managers, employee relations, performance and comp cycles, org change.',
    track: 'ai301-hrbp',
  },
  {
    id: 'recruiter',
    label: 'Recruiting / Talent Acquisition',
    detail: 'Owning requisitions end to end, or the process they run through — sourcing, screening, interview design, offers.',
    track: 'ai301-recruiter',
  },
  {
    id: 'comp',
    label: 'Compensation & Benefits',
    detail: 'Total rewards — the merit cycle, benchmarking, job architecture, plan design, renewals, pay equity.',
    track: 'ai301-comp',
  },
  {
    id: 'peopleanalytics',
    label: 'People Analytics',
    detail: 'Workforce analytics and planning, the reporting surface, the engagement survey programme, attrition and predictive work, DEI measurement.',
    track: 'ai301-analytics',
  },
  {
    id: 'other',
    label: 'Something else in People',
    detail: "Talent development, employee experience, People ops, or leading the function. Tell us below — you'll start on the business partner track while yours is built.",
    track: DEFAULT_TRACK,
  },
];

export const ROLE_IDS = ROLE_CHOICES.map((r) => r.id);

export const roleChoice = (id: string | undefined) => ROLE_CHOICES.find((r) => r.id === id);

// The specialist track a learner should see. Falls back to the HRBP track for
// unknown ids and for roles whose track hasn't been authored — callers pass
// the set of course ids that actually exist so an unbuilt track never strands
// a learner on an empty course.
export const trackForRole = (id: string | undefined, availableCourseIds?: Iterable<string>): string => {
  const wanted = roleChoice(id)?.track ?? DEFAULT_TRACK;
  if (!availableCourseIds) return wanted;
  const available = new Set(availableCourseIds);
  return available.has(wanted) ? wanted : DEFAULT_TRACK;
};

// Every 301 track id, so the path and library can hide the ones that aren't
// this learner's without needing to know which roles exist.
export const ALL_TRACK_IDS = Array.from(new Set(ROLE_CHOICES.map((r) => r.track)));
