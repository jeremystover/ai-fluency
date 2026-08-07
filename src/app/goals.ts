// Goal options offered in the intake. Ids are the stable keys stored in
// fd_preference; labels are UI copy shared by the wizard and the plan.

export type GoalChoice = { id: string; label: string; detail: string };

export const GOAL_CHOICES: GoalChoice[] = [
  { id: 'fluency', label: 'Test and develop my AI fluency', detail: 'Find out where you actually stand, then close the gaps.' },
  { id: 'apply', label: 'Apply AI to my day-to-day job', detail: 'Less theory, more of your actual work getting easier.' },
  { id: 'workflows', label: 'Build workflows and automations', detail: 'Beyond chat: multi-step work that runs itself.' },
  { id: 'tools', label: 'Understand the differences between tools', detail: 'Claude vs ChatGPT vs the AI already in your HR stack.' },
  { id: 'news', label: 'Stay on top of trends and tools', detail: 'Keep current without making it a second job.' },
  { id: 'safety', label: 'Use AI safely with people data', detail: "Know what's safe to paste, and under what agreement." },
  { id: 'coach', label: 'Help my team adopt AI', detail: 'Lead the change, not just survive it.' },
  { id: 'confidence', label: 'Stop feeling behind', detail: 'Replace vague anxiety with a working mental model.' },
];

export const goalLabel = (id: string) => GOAL_CHOICES.find((g) => g.id === id)?.label ?? id;
