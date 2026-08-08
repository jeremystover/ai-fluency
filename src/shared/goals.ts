// Goal options offered in the intake. Ids are the stable keys stored in
// fd_preference; labels are UI copy shared by the wizard, the plan, and the
// path. Each goal maps to the modules (and later courses) that serve it —
// that mapping is what turns "what do you want?" into visible "recommended
// for you" markers, so the learner can watch their answers shape the path.

export type GoalChoice = {
  id: string;
  label: string;
  detail: string;
  modules: string[]; // ai101 module ids this goal points at
  courses: string[]; // later courses this goal points at
};

export const GOAL_CHOICES: GoalChoice[] = [
  {
    id: 'fluency',
    label: 'Build my foundations',
    detail: "The working mental model — what AI is, what it isn't, when to trust it. Everything else stands on this.",
    modules: ['ai101-m1', 'ai101-m3', 'ai101-m6'],
    courses: [],
  },
  {
    id: 'apply',
    label: 'Put AI to work in my job',
    detail: 'Real tasks from your week — write-ups, summaries, policies, drafts — done in minutes, checked by you.',
    modules: ['ai101-m2', 'ai101-m4', 'ai101-m5'],
    courses: ['ai201'],
  },
  {
    id: 'workflows',
    label: 'Become an automation ninja',
    detail: 'Go past chat: multi-step workflows and agents that do the work while you review it.',
    modules: ['ai101-m5'],
    courses: ['ai201'],
  },
  {
    id: 'tools',
    label: 'Know the tools cold',
    detail: 'Claude, ChatGPT, and the AI already in your HR stack — which is which, and what each is actually for.',
    modules: ['ai101-m2', 'ai101-m3'],
    courses: [],
  },
  {
    id: 'strategy',
    label: 'Make the big calls',
    detail: 'Understand enough to set direction: where your organization should use AI, where it must not, and how to decide.',
    modules: ['ai101-m7', 'ai101-m8'],
    courses: ['ai301', 'ai401'],
  },
  {
    id: 'safety',
    label: 'Keep people data safe',
    detail: "Know exactly what's safe to paste, and under what agreement — before anyone has to ask.",
    modules: ['ai101-m4', 'ai101-m6', 'ai101-m7', 'ai101-m8'],
    courses: [],
  },
  {
    id: 'coach',
    label: 'Bring everyone with me',
    detail: 'Lead the adoption story — coach your team and other functions instead of watching it happen to you.',
    modules: ['ai101-m7'],
    courses: ['ai301'],
  },
  {
    id: 'confidence',
    label: 'Stop feeling behind',
    detail: 'Swap the vague anxiety for a working model. Two modules in, the headlines start making sense.',
    modules: ['ai101-m1', 'ai101-m5', 'ai101-m6'],
    courses: [],
  },
];

export const goalLabel = (id: string) => GOAL_CHOICES.find((g) => g.id === id)?.label ?? id;
