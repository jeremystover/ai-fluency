import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ContentBlock, ModuleContentResponse } from '../../shared/types';
import { Screen, Markdown, Button, ErrorNote } from '../components/ui';
import SortingExercise from '../components/SortingExercise';
import ChoiceExercise from '../components/ChoiceExercise';
import { api, ApiError, track } from '../api';

const COURSE_LABELS: Record<string, string> = { ai101: 'AI 101', ai201: 'AI 201' };

// A module's opening prediction — captured before the content, echoed later.
function CalibrationPrompt({ block, moduleId }: { block: ContentBlock; moduleId: string }) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const save = async () => {
    if (!text.trim()) return;
    try {
      await api.post(`/api/module/${moduleId}/calibration`, { text });
      setSaved(true);
    } catch {
      // Non-blocking: the prediction's value is in the writing, not the saving.
      setSaved(true);
    }
  };
  return (
    <div className="border-l-4 border-signal bg-signal/10 rounded-r-brand p-5 my-5">
      <Markdown source={block.body} className="text-[0.95rem] [&_h2]:mt-0 [&_h2]:text-xl" />
      {saved ? (
        <p className="label-utility mt-3">Recorded. It comes back at the capstone.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="Write the prediction down here — numbers included."
            className="w-full border border-line-strong bg-surface rounded-brand px-3 py-2 text-sm text-ink focus:border-accent placeholder:text-muted/60"
          />
          <div>
            <Button onClick={save} disabled={!text.trim()} variant="quiet">Record it</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Answer keys and reveals in modules whose exercises are static (honest tags:
// the interactive version ships with the full course).
function Reveal({ block }: { block: ContentBlock }) {
  const [open, setOpen] = useState(false);
  const lines = block.body.split('\n');
  const heading = lines[0].replace(/^#+\s*/, '');
  const rest = lines.slice(1).join('\n').trim();
  return (
    <div className="border border-line-strong rounded-brand my-5 overflow-hidden" id={block.id}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-bg hover:bg-line/30 transition-colors text-left"
      >
        <span className="font-display font-semibold text-ink-strong text-[0.95rem]">{heading}</span>
        <span className="font-utility text-[0.65rem] uppercase tracking-wider text-muted">{open ? 'Hide' : 'Commit first, then reveal'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 anim-fade">
          <Markdown source={rest} className="text-[0.95rem]" />
        </div>
      )}
    </div>
  );
}

function TryThis({ block }: { block: ContentBlock }) {
  const [open, setOpen] = useState(false);
  const opened = useRef(false);
  const lines = block.body.split('\n');
  const heading = lines[0].replace(/^#+\s*/, '');
  const rest = lines.slice(1).join('\n').trim();
  return (
    <div className="border border-accent/40 rounded-brand my-5 overflow-hidden">
      <button
        onClick={() => {
          setOpen(!open);
          if (!opened.current) {
            opened.current = true;
            track('try_this_opened', { blockId: block.id });
          }
        }}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-accent/[0.04] hover:bg-accent/[0.08] transition-colors text-left"
      >
        <span className="font-display font-semibold text-accent text-[0.95rem]">{heading}</span>
        <span className="font-utility text-xs text-accent" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 anim-fade">
          <Markdown source={rest} className="text-[0.95rem]" />
        </div>
      )}
    </div>
  );
}

function VolatileMark({ block }: { block: ContentBlock }) {
  return (
    <span className="group absolute -left-4 sm:-left-6 top-2 flex" tabIndex={0} aria-label={`Example layer — refreshed independently of concepts. Current as of ${block.reviewedAt}.`}>
      <span className="w-2 h-2 rounded-full bg-signal border border-ink-strong/50 cursor-help" aria-hidden="true" />
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-utility text-[0.65rem] bg-ink-strong text-surface px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-30">
        example layer · current as of {block.reviewedAt}
      </span>
    </span>
  );
}

function Block({ block, moduleId }: { block: ContentBlock; moduleId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const logged = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !logged.current) {
          logged.current = true;
          track('block_read', { blockId: block.id });
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [block.id]);

  if (block.kind === 'try_this') {
    return (
      <div ref={ref}>
        <TryThis block={block} />
      </div>
    );
  }
  if (block.kind === 'calibration_prompt') {
    return (
      <div ref={ref} id={block.id}>
        <CalibrationPrompt block={block} moduleId={moduleId} />
      </div>
    );
  }
  if (block.kind === 'reveal') {
    return (
      <div ref={ref}>
        <Reveal block={block} />
      </div>
    );
  }
  if (block.kind === 'exercise') {
    const payload = JSON.parse(block.body) as { type: string; title?: string; intro?: string; blurb?: string; estMinutes?: string };
    if (payload.type === 'sorting') {
      return (
        <div ref={ref} id={block.id}>
          <SortingExercise moduleId={moduleId} title={payload.title ?? 'Exercise'} intro={payload.intro ?? ''} />
        </div>
      );
    }
    if (payload.type === 'choice') {
      return (
        <div ref={ref} id={block.id}>
          <ChoiceExercise moduleId={moduleId} />
        </div>
      );
    }
    return (
      <div ref={ref} className="border border-ink-strong rounded-brand bg-surface p-5 sm:p-6 my-6">
        <p className="label-utility">Applied activity · {payload.estMinutes} min · AI-graded</p>
        <h3 className="font-display font-semibold text-ink-strong text-xl mt-2">{payload.title}</h3>
        <p className="text-sm text-ink mt-2">{payload.blurb}</p>
        <Link
          to={`/module/${moduleId}/activity`}
          className="inline-flex mt-4 items-center px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline"
        >
          Start the activity
        </Link>
      </div>
    );
  }
  const isAside = block.kind === 'callout' || block.kind === 'takeaways';
  return (
    <div ref={ref} id={block.id} className="relative">
      {block.layer === 'volatile' && <VolatileMark block={block} />}
      {isAside ? (
        <div className="border border-line rounded-brand bg-surface p-5 my-5">
          <Markdown source={block.body} className="text-[0.95rem] [&_h3]:mt-0 [&_h2]:mt-0 [&_h2]:text-xl" />
        </div>
      ) : (
        <Markdown source={block.body} />
      )}
    </div>
  );
}

export default function ModuleView() {
  const moduleId = useParams().moduleId ?? 'ai101-m1';
  const [data, setData] = useState<ModuleContentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData(null);
    api
      .get<ModuleContentResponse>(`/api/module/${moduleId}`)
      .then((d) => {
        setData(d);
        track('module_opened', { moduleId });
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : 'The module did not load. Reload to try again.'));
  }, [moduleId]);

  const sections = useMemo(
    () =>
      (data?.blocks ?? [])
        .filter((b) => (b.kind === 'prose' || b.kind === 'takeaways' || b.kind === 'reveal') && b.body.startsWith('## '))
        .map((b) => ({ id: b.id, title: b.body.split('\n')[0].replace(/^##\s*/, '') })),
    [data],
  );

  // Scroll-linked TOC + honest reading progress.
  useEffect(() => {
    if (!data) return;
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const done = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? done / total : 1);
      let current: string | null = null;
      for (const s of sections) {
        const sec = document.getElementById(s.id);
        if (sec && sec.getBoundingClientRect().top < window.innerHeight * 0.35) current = s.id;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [data, sections]);

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!data) return <Screen><div className="pt-24 text-center"><p className="label-utility">Loading the module…</p></div></Screen>;

  return (
    <>
      <div className="sticky top-14 z-30 h-0.5 bg-line" aria-hidden="true">
        <div className="h-full bg-accent origin-left transition-transform duration-150" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <Screen wide>
        <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10 pt-8">
          <nav className="hidden lg:block sticky top-24 self-start" aria-label="Contents">
            <p className="label-utility mb-3">Contents · ~{data.estReadMinutes} min read</p>
            <ul className="flex flex-col gap-1 border-l border-line">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block pl-3 py-1 text-[0.8rem] leading-snug no-underline border-l-2 -ml-px transition-colors ${
                      activeSection === s.id ? 'border-accent text-ink-strong font-semibold' : 'border-transparent text-muted hover:text-ink'
                    }`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article ref={articleRef} className="max-w-2xl">
            <p className="label-utility">
              {COURSE_LABELS[data.module.courseId] ?? data.module.courseId} · Module {data.module.ordinal} · ~{data.estReadMinutes} min read
            </p>
            <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 tracking-tight">{data.module.title}</h1>
            <p className="text-muted mt-2">{data.module.blurb}</p>
            {data.capabilities.micro && (
              <p className="text-sm mt-2">
                <Link to={`/module/${moduleId}/micro`} className="text-accent no-underline hover:underline">Short on time? The two-minute version →</Link>
              </p>
            )}

            {data.capabilities.chat && (
              <div className="mt-5 border border-accent/40 rounded-brand bg-accent/[0.04] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
                <p className="text-sm text-ink">
                  <span className="font-display font-semibold text-accent">Prefer to talk it through?</span> The module tutor teaches this same
                  material in conversation — lecturettes, questions, quizzes, your pace. Type or speak; it can read replies aloud.
                </p>
                <Link to={`/module/${moduleId}/chat`} className="text-accent font-semibold text-sm no-underline hover:underline whitespace-nowrap">
                  Open the tutor →
                </Link>
              </div>
            )}
            {data.capabilities.podcast && (
              <Link
                to={`/module/${moduleId}/podcast`}
                className="mt-2 flex items-center justify-between gap-3 border border-line rounded-brand bg-surface px-4 py-3 no-underline hover:border-ink-strong transition-colors group"
              >
                <span>
                  <span className="font-display font-semibold text-ink-strong text-[0.95rem]">Prefer to listen? Make it a podcast.</span>
                  <span className="block text-xs text-muted mt-0.5">Two hosts talk through this module from whatever angle you give them.</span>
                </span>
                <span className="text-accent font-semibold text-sm shrink-0 group-hover:underline" aria-hidden="true">Open the studio →</span>
              </Link>
            )}

            <div className="mt-6 sm:pl-2">
              {data.blocks.filter((b) => b.moduleId === moduleId).map((b) => (
                <Block key={b.id} block={b} moduleId={moduleId} />
              ))}
            </div>

            <footer className="mt-12 border-t border-line pt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
              <span className="font-utility text-[0.7rem] text-muted">
                Concepts reviewed {data.stamps.conceptsReviewedAt ?? '—'} · Examples current as of {data.stamps.examplesCurrentAsOf ?? '—'}
              </span>
              <span className="flex items-center gap-4">
                {data.capabilities.chat && (
                  <Link to={`/module/${moduleId}/chat`} className="text-accent font-semibold text-sm no-underline hover:underline">
                    Discuss with the tutor →
                  </Link>
                )}
                {data.capabilities.knowledgeCheck && (
                  <Link to={`/module/${moduleId}/check`} className="text-accent font-semibold text-sm no-underline hover:underline">
                    Knowledge check →
                  </Link>
                )}
                {data.capabilities.activity && (
                  <Link to={`/module/${moduleId}/activity`} className="text-accent font-semibold text-sm no-underline hover:underline">
                    Applied activity →
                  </Link>
                )}
              </span>
            </footer>
          </article>
        </div>
      </Screen>
    </>
  );
}
