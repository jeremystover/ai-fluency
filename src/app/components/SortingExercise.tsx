import { useEffect, useRef, useState } from 'react';
import type { SortingBucket, SortingReveal, SortingTaskPublic } from '../../shared/types';
import { api, ApiError } from '../api';
import { Button, ErrorNote } from './ui';
import { usePrefersReducedMotion, useDevice } from '../brand';

// Any number of tasks, two to four buckets. The interaction reshapes to the
// device: mouse users drag (or use 1..N on the keyboard); touch users tap a
// card and a bottom bar rises with the buckets — no dragging, no scrolling
// back and forth, no keyboard hints they can't use. Nothing reveals until
// every task is committed.

type Assignments = Record<string, string | undefined>;

export default function SortingExercise({ moduleId, intro, title }: { moduleId: string; intro: string; title: string }) {
  const reduced = usePrefersReducedMotion();
  const { coarse } = useDevice();
  const [buckets, setBuckets] = useState<SortingBucket[]>([]);
  const [tasks, setTasks] = useState<SortingTaskPublic[]>([]);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [reveal, setReveal] = useState<SortingReveal | null>(null);
  const [revealStage, setRevealStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const liveRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    api
      .get<{ buckets: SortingBucket[]; tasks: SortingTaskPublic[] }>(`/api/module/${moduleId}/sorting`)
      .then((d) => {
        setBuckets(d.buckets);
        setTasks(d.tasks);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : 'The exercise did not load. Reload the page to try again.'));
  }, [moduleId]);

  const announce = (msg: string) => {
    if (liveRef.current) liveRef.current.textContent = msg;
  };

  const assign = (taskId: string, bucketId: string | undefined) => {
    setAssignments((prev) => {
      const next = { ...prev, [taskId]: bucketId };
      const committed = Object.values(next).filter(Boolean).length;
      const bucket = buckets.find((b) => b.id === bucketId);
      announce(bucketId ? `Assigned to ${bucket?.label}. ${tasks.length - committed} remaining.` : `Returned to the tray.`);
      return next;
    });
    setSelected(null);
  };

  const committed = Object.values(assignments).filter(Boolean).length;
  const allCommitted = tasks.length > 0 && committed === tasks.length;
  const unassigned = tasks.filter((t) => !assignments[t.id]);

  const onChipKey = (e: React.KeyboardEvent, taskId: string) => {
    const i = buckets.map((_, idx) => String(idx + 1)).indexOf(e.key);
    if (i >= 0 && buckets[i]) {
      e.preventDefault();
      assign(taskId, buckets[i].id);
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      e.preventDefault();
      assign(taskId, undefined);
    }
  };

  const submit = async () => {
    if (!allCommitted || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<SortingReveal>(`/api/module/${moduleId}/sort`, { assignments });
      setReveal(res);
      if (reduced) setRevealStage(5);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'The reveal didn’t load. Your sorting is still here — try again.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!reveal || reduced) return;
    const timers = [1, 2, 3, 4, 5].map((s) => setTimeout(() => setRevealStage(s), 350 + (s - 1) * 700));
    return () => timers.forEach(clearTimeout);
  }, [reveal, reduced]);

  const chip = (task: SortingTaskPublic, inBucket: boolean) => (
    <button
      key={task.id}
      draggable={!reveal && !coarse}
      onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
      onClick={() => {
        if (inBucket) assign(task.id, undefined);
        else setSelected(selected === task.id ? null : task.id);
      }}
      onKeyDown={(e) => onChipKey(e, task.id)}
      aria-pressed={selected === task.id}
      className={`text-left text-sm leading-snug border rounded-brand px-3 py-2 bg-surface transition-colors w-full
        ${coarse ? '' : 'cursor-grab active:cursor-grabbing'}
        ${selected === task.id ? 'border-accent ring-2 ring-accent/30' : 'border-line hover:border-line-strong'}`}
      title={
        coarse
          ? undefined
          : inBucket
            ? `Click to return to the tray, or press 1–${buckets.length} to move`
            : `Click to select, then pick a bucket — or drag, or press 1–${buckets.length}`
      }
    >
      {task.text}
    </button>
  );

  const selectedTask = selected ? tasks.find((task) => task.id === selected) : null;

  if (reveal) {
    const groups = buckets.map((b) => ({ bucket: b, rows: reveal.results.filter((r) => r.key === b.id) }));
    return (
      <div className="border border-ink-strong rounded-brand bg-surface p-5 sm:p-7 my-6">
        <p className="label-utility">Exercise · the reveal</p>
        <h3 className="font-display font-semibold text-ink-strong text-xl mt-2">{title}</h3>
        {groups.map(({ bucket, rows }, gi) => (
          <div
            key={bucket.id}
            className="mt-6 transition-opacity duration-500"
            style={{ opacity: revealStage > gi ? 1 : 0 }}
            aria-hidden={revealStage <= gi}
          >
            <h4 className="font-utility text-xs uppercase tracking-wider text-ink-strong border-b border-line-strong pb-2">
              {bucket.label} <span className="text-muted normal-case tracking-normal">· {bucket.hint}</span>
            </h4>
            <ul className="mt-1 divide-y divide-line">
              {rows.map((r) => (
                <li key={r.taskId} className="py-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 shrink-0 font-utility text-[0.65rem] px-1.5 py-0.5 rounded-full ${
                        r.correct ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {r.correct ? 'you agreed' : `you said: ${buckets.find((b) => b.id === r.chosen)?.label.toLowerCase()}`}
                    </span>
                    <span className="text-sm text-ink-strong leading-snug">{r.text}</span>
                  </div>
                  <p className="text-sm text-muted mt-1.5 pl-1">{r.reasoning}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div
          className="mt-8 border-l-4 border-signal bg-signal/10 rounded-r-brand p-4 sm:p-5 transition-opacity duration-700"
          style={{ opacity: revealStage >= 4 ? 1 : 0 }}
        >
          <p className="label-utility">The pattern — this is what the exercise measures</p>
          <p className="font-display font-semibold text-ink-strong text-lg mt-2 leading-snug">{reveal.pattern}</p>
        </div>
        <div className="mt-4 transition-opacity duration-700" style={{ opacity: revealStage >= 5 ? 1 : 0 }}>
          <p className="text-sm text-muted">
            For the record: {reveal.score.correct} of {reveal.score.total} matched the key
            {reveal.overAssigned > 0 && `, ${reveal.overAssigned} placed above where the key puts them`}
            {reveal.underAssigned > 0 && `, ${reveal.underAssigned} placed below`}. {reveal.postscript}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-ink-strong rounded-brand bg-surface p-5 sm:p-7 my-6">
      <p className="label-utility">Exercise · interactive</p>
      <h3 className="font-display font-semibold text-ink-strong text-xl mt-2">{title}</h3>
      <div className="text-sm text-ink mt-3 whitespace-pre-line">{intro.replace(/\*\*/g, '')}</div>
      <p ref={liveRef} className="sr-only" aria-live="polite" />
      {error && <div className="mt-4"><ErrorNote message={error} /></div>}

      {coarse && tasks.length > 0 && (
        <p className="text-xs text-muted mt-3">Tap a card to pick it up, then tap where it belongs.</p>
      )}

      {unassigned.length > 0 && (
        <div className="mt-5">
          <p className="label-utility mb-2">Tray · {unassigned.length} to sort</p>
          <div className="grid gap-2 sm:grid-cols-2">{unassigned.map((task) => chip(task, false))}</div>
        </div>
      )}

      <div className={`mt-5 grid gap-3 ${buckets.length === 2 ? 'sm:grid-cols-2' : buckets.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
        {buckets.map((b, i) => {
          const contents = tasks.filter((task) => assignments[task.id] === b.id);
          return (
            <div
              key={b.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain');
                if (id) assign(id, b.id);
              }}
              className="border border-dashed border-line-strong rounded-brand p-3 min-h-28 bg-bg/60"
            >
              <button
                onClick={() => selected && assign(selected, b.id)}
                className={`w-full text-left rounded-brand px-2 py-1.5 transition-colors ${selected ? 'bg-accent/10 cursor-pointer' : ''}`}
                disabled={!selected}
                aria-label={`Assign selected task to ${b.label}`}
              >
                <span className="font-utility text-xs uppercase tracking-wider text-ink-strong">
                  {!coarse && <span className="text-muted mr-1">{i + 1}</span>}
                  {b.label}
                </span>
                <span className="block text-[0.7rem] text-muted mt-0.5">{b.hint}</span>
              </button>
              <div className="mt-2 flex flex-col gap-2">{contents.map((task) => chip(task, true))}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
        <span className="font-utility text-xs text-muted">{committed} of {tasks.length} committed</span>
        <Button onClick={submit} disabled={!allCommitted || busy}>
          {busy ? 'Scoring…' : allCommitted ? 'Reveal' : `Commit all ${tasks.length} to reveal`}
        </Button>
      </div>

      {/* Touch flow: the picked-up card's destinations rise to the thumb —
          no scrolling between the tray and the buckets. */}
      {coarse && selectedTask && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-surface shadow-[0_-8px_24px_rgba(0,0,0,0.08)] pb-safe anim-fade">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-ink leading-snug line-clamp-2">
                <span className="label-utility mr-1.5">Placing</span>
                {selectedTask.text}
              </p>
              <button onClick={() => setSelected(null)} className="text-xs text-muted underline shrink-0 py-1" aria-label="Put the card back">
                Cancel
              </button>
            </div>
            <div className="mt-2.5 grid gap-2 grid-cols-2">
              {buckets.map((b) => (
                <button
                  key={b.id}
                  onClick={() => assign(selectedTask.id, b.id)}
                  className="text-left border border-line-strong rounded-brand px-3 py-2.5 bg-bg active:bg-accent/10 transition-colors"
                >
                  <span className="font-utility text-[0.65rem] uppercase tracking-wider text-ink-strong block">{b.label}</span>
                  <span className="text-[0.7rem] text-muted leading-snug block mt-0.5">{b.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
