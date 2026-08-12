import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import '@fontsource/caveat/700.css';
import type { CalibrationField, CohortResponse, ContentBlock, ModuleContentResponse } from '../../shared/types';
import { Screen, Markdown, Button, ErrorNote } from '../components/ui';
import SortingExercise from '../components/SortingExercise';
import ChoiceExercise from '../components/ChoiceExercise';
import { ModuleLead, ModuleRail, styleOf, tutorHref, STYLE_LABELS } from '../components/ModuleHub';
import { api, ApiError, track } from '../api';
import { useApp } from '../brand';
import { firstVisitRedirect } from '../modality';
import { depthOf } from '../../shared/depth';

const COURSE_LABELS: Record<string, string> = { ai101: 'AI 101', ai201: 'AI 201' };

const HAND_FONT = "'Caveat', 'Comic Sans MS', cursive";

// A module's opening prediction — captured before the content, echoed at the
// capstone. Rendered as a field note: lined card, taped corner, the learner's
// words in their "own hand" — a personal artifact pinned into the read.
function CalibrationPrompt({
  block,
  moduleId,
  fields,
  savedValues,
}: {
  block: ContentBlock;
  moduleId: string;
  fields: CalibrationField[];
  savedValues: Record<string, number>;
}) {
  const [text, setText] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(Object.keys(savedValues).length > 0);
  const [mine, setMine] = useState<Record<string, number>>(savedValues);
  const [cohort, setCohort] = useState<CohortResponse | null>(null);
  const numbersReady = fields.every((f) => (values[f.key] ?? '').trim() !== '');
  const save = async () => {
    if (!text.trim() && !numbersReady) return;
    const numeric: Record<string, number> = {};
    for (const [k, v] of Object.entries(values)) if (v.trim() !== '') numeric[k] = Number(v);
    try {
      await api.post(`/api/module/${moduleId}/calibration`, { text, values: numeric });
      setMine((prev) => ({ ...prev, ...numeric }));
      setSaved(true);
    } catch {
      // Non-blocking: the prediction's value is in the writing, not the saving.
      setSaved(true);
    }
  };
  // Only ever fetched once the learner's own number is committed — the server
  // enforces that too, and refuses to answer for a field they haven't answered.
  useEffect(() => {
    if (!saved || !fields.length || cohort) return;
    api
      .get<CohortResponse>(`/api/module/${moduleId}/cohort`)
      .then(setCohort)
      .catch(() => {});
  }, [saved, fields.length, cohort, moduleId]);
  return (
    <div
      className="relative border border-line-strong bg-surface px-5 pt-5 pb-4 my-7 shadow-sm -rotate-[0.4deg]"
      style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, var(--c-line) 27px, var(--c-line) 28px)' }}
    >
      <span aria-hidden="true" className="absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-1 w-24 h-5 bg-signal/70 rounded-[1px]" />
      <Markdown source={block.body} className="text-[0.95rem] [&_h2]:mt-0 [&_h2]:text-xl" />
      {saved ? (
        <div className="mt-3">
          {text.trim() && (
            <p className="text-ink-strong text-2xl" style={{ fontFamily: HAND_FONT, lineHeight: '28px' }}>{text}</p>
          )}
          {Object.keys(mine).length > 0 && (
            <p className="font-utility text-xs text-ink-strong mt-1.5">
              {fields
                .filter((f) => mine[f.key] !== undefined)
                .map((f) => `${f.label}: ${mine[f.key]}`)
                .join(' · ')}
            </p>
          )}
          {cohort?.stats.length ? (
            <div className="mt-3 border-t border-line pt-2.5 flex flex-col gap-1.5">
              {cohort.stats
                .filter((s) => mine[s.key] !== undefined)
                .map((s) => {
                  const field = fields.find((f) => f.key === s.key);
                  const you = mine[s.key];
                  const lean = you > s.median ? 'higher than' : you < s.median ? 'lower than' : 'level with';
                  return (
                    <p key={s.key} className="font-utility text-xs text-muted">
                      <span className="text-ink-strong">{field?.label ?? s.key}</span> · you said{' '}
                      <span className="text-ink-strong">{you}</span>, {lean} the median of{' '}
                      <span className="text-ink-strong">{s.median}</span> from {s.n} others (middle half {s.p25}–{s.p75}).
                      {s.closed && (
                        <>
                          {' '}Of the {s.closed.n} who have since measured it, the typical miss was{' '}
                          <span className="text-ink-strong">{s.closed.medianAbsDelta}</span> and {s.closed.overPct}% predicted high.
                        </>
                      )}
                    </p>
                  );
                })}
            </div>
          ) : null}
          <p className="label-utility mt-2">Recorded · it comes back at the capstone.</p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {fields.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {fields.map((f) => (
                <label key={f.key} className="flex flex-col gap-1">
                  <span className="font-utility text-[0.7rem] text-ink-strong">{f.label}</span>
                  <input
                    type="number"
                    min={f.min}
                    max={f.max}
                    value={values[f.key] ?? ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="border border-line-strong bg-surface rounded-brand px-3 py-1.5 font-utility text-sm text-ink-strong w-28 focus:border-accent placeholder:text-muted/60"
                  />
                </label>
              ))}
            </div>
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder={fields.length ? 'And the parts a number can’t hold — name the item, the step, the reason.' : 'Write the prediction down here — numbers included.'}
            className="w-full border border-line-strong bg-surface/80 rounded-brand px-3 py-2 text-xl text-ink-strong focus:border-accent placeholder:text-muted/60"
            style={{ fontFamily: HAND_FONT, lineHeight: '28px' }}
          />
          <div>
            <Button onClick={save} disabled={!text.trim() && !numbersReady} variant="quiet">Record it</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Answer keys and reveals in modules whose exercises are static (honest tags:
// the interactive version ships with the full course). Kept boxed — the
// commit-first-then-reveal move is interactive, and interactive gets borders.
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

// Try-this asides hang off an accent rule instead of sitting in a box —
// prose keeps its own voice, and borders stay reserved for live surfaces.
function TryThis({ block }: { block: ContentBlock }) {
  const [open, setOpen] = useState(false);
  const opened = useRef(false);
  const lines = block.body.split('\n');
  const heading = lines[0].replace(/^#+\s*/, '');
  const rest = lines.slice(1).join('\n').trim();
  return (
    <div className="border-l-2 border-accent pl-5 my-6">
      <button
        onClick={() => {
          setOpen(!open);
          if (!opened.current) {
            opened.current = true;
            track('try_this_opened', { blockId: block.id });
          }
        }}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 py-1 text-left"
      >
        <span className="font-utility text-[0.68rem] uppercase tracking-wider text-accent font-semibold">{heading}</span>
        <span className="font-utility text-xs text-accent" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="pt-1 anim-fade">
          <Markdown source={rest} className="text-[0.95rem]" />
        </div>
      )}
    </div>
  );
}

// The example layer, worn openly: volatile blocks sit in a dashed frame with
// a dated stamp — content freshness as a visible promise instead of a
// hover-only dot.
function VolatileFrame({ block, children }: { block: ContentBlock; children: React.ReactNode }) {
  return (
    <div className="relative border border-dashed border-line-strong rounded-brand bg-surface px-4 my-5">
      <span className="absolute -top-2 right-3 font-utility text-[0.58rem] uppercase tracking-wider bg-signal text-on-signal px-2 py-0.5 rounded-sm">
        example layer · {block.reviewedAt}
      </span>
      {children}
    </div>
  );
}

function Block({
  block,
  moduleId,
  openingFields,
  openingValues,
}: {
  block: ContentBlock;
  moduleId: string;
  openingFields: CalibrationField[];
  openingValues: Record<string, number>;
}) {
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
        <CalibrationPrompt block={block} moduleId={moduleId} fields={openingFields} savedValues={openingValues} />
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

  // Asides, de-boxed: takeaways get the signal band, callouts hang off a
  // quiet rule. Boxes are for live surfaces only.
  const inner =
    block.kind === 'takeaways' ? (
      <div className="border-l-[3px] border-signal rounded-r-brand px-5 py-4 my-8 bg-gradient-to-r from-signal/10 to-transparent">
        <Markdown source={block.body} className="text-[0.97rem] [&_h3]:mt-0 [&_h2]:mt-0 [&_h2]:text-xl" />
      </div>
    ) : block.kind === 'callout' ? (
      <div className="border-l-2 border-line-strong pl-5 my-6">
        <Markdown source={block.body} className="text-[0.95rem] [&_h3]:mt-0 [&_h2]:mt-0 [&_h2]:text-xl" />
      </div>
    ) : (
      <Markdown source={block.body} />
    );

  return (
    <div ref={ref} id={block.id}>
      {block.layer === 'volatile' ? <VolatileFrame block={block}>{inner}</VolatileFrame> : inner}
    </div>
  );
}

// The command bar: a slim pill that follows the learner once the module
// header scrolls away — where they are, how far along, and the module's exit.
// On phones (no rail) it is the only progress chrome; on desktop it echoes
// the spine.
function CommandBar({
  visible,
  label,
  progress,
  checkHref,
  checkLabel,
}: {
  visible: boolean;
  label: string;
  progress: number;
  checkHref: string | null;
  checkLabel: string;
}) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-16 z-30 px-5 transition-all duration-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
    >
      <div className="max-w-xl mx-auto flex items-center gap-3 rounded-full bg-ink-strong text-surface py-1.5 pl-5 pr-1.5 shadow-lg shadow-ink-strong/25 text-[0.82rem]">
        <span className="font-display font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
        <span aria-hidden="true" className="flex-1 h-[3px] min-w-10 rounded bg-surface/25 overflow-hidden">
          <span className="block h-full bg-signal" style={{ width: `${Math.round(progress * 100)}%` }} />
        </span>
        {checkHref && (
          <Link to={checkHref} tabIndex={visible ? 0 : -1} className="rounded-full bg-signal text-on-signal font-display font-semibold text-[0.78rem] px-3.5 py-1.5 no-underline whitespace-nowrap">
            {checkLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ModuleView() {
  const moduleId = useParams().moduleId ?? 'ai101-m1';
  const [data, setData] = useState<ModuleContentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [barVisible, setBarVisible] = useState(false);
  const [listenOpen, setListenOpen] = useState(false);
  const completedTracked = useRef(false);
  const { me } = useApp();
  const navigate = useNavigate();
  const redirected = useRef(false);

  // Honor the stated learning style: a chat-first learner's first visit to
  // the module goes straight to the tutor (it greets them there). Once
  // they've used it — or for every other style — this page is home base.
  useEffect(() => {
    if (!me || redirected.current) return;
    const target = firstVisitRedirect(me, moduleId);
    if (target) {
      redirected.current = true;
      navigate(target, { replace: true });
    }
  }, [me, navigate, moduleId]);
  const articleRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData(null);
    setListenOpen(false);
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

  // Study links from the knowledge check land on a specific lesson block —
  // scroll there once the content has rendered (Screen resets to top on mount).
  const { hash } = useLocation();
  useEffect(() => {
    if (!data || !hash) return;
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    const timer = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    return () => clearTimeout(timer);
  }, [data, hash]);

  // The rail's "sorting exercise" entry and the hands-on lead's second door
  // scroll to the live exercise embedded in the read, if this module ships one.
  const sortingAnchorId = useMemo(() => {
    for (const b of data?.blocks ?? []) {
      if (b.kind !== 'exercise') continue;
      try {
        if ((JSON.parse(b.body) as { type?: string }).type === 'sorting') return b.id;
      } catch {
        // Malformed payload — no anchor for this one.
      }
    }
    return undefined;
  }, [data]);

  // Scroll-linked spine + honest reading progress. Reaching the end IS
  // completing the read — that's what unlock hints and the plan key off,
  // not the separately-graded applied activity. The command bar appears
  // once the module header (title + lead) scrolls out of view.
  useEffect(() => {
    if (!data) return;
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const done = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const p = total > 0 ? done / total : 1;
      setProgress(p);
      if (p >= 0.97 && !completedTracked.current) {
        completedTracked.current = true;
        track('module_completed', { moduleId });
      }
      setBarVisible((headerRef.current?.getBoundingClientRect().bottom ?? 1) < 64);
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
  }, [data, sections, moduleId]);

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!data) return <Screen><div className="pt-24 text-center"><p className="label-utility">Loading the module…</p></div></Screen>;

  const style = styleOf(me);
  const courseLabel = COURSE_LABELS[data.module.courseId] ?? data.module.courseId;
  const essentials = depthOf(me?.prefs?.depth) === 'essentials';
  const activeTitle = sections.find((s) => s.id === activeSection)?.title;
  const barLabel = `M${data.module.ordinal} · ${activeTitle ?? data.module.title}`;
  const jumpToLead = () => headerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const toggleListen = () => {
    setListenOpen((open) => {
      if (!open) setTimeout(jumpToLead, 60);
      return !open;
    });
  };

  return (
    <>
      <CommandBar
        visible={barVisible}
        label={barLabel}
        progress={progress}
        checkHref={data.capabilities.knowledgeCheck ? `/module/${moduleId}/check` : null}
        checkLabel={style === 'quiz_first' ? 'Take the check' : 'Knowledge check'}
      />
      <Screen wide>
        <div className="lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12 pt-8">
          <ModuleRail
            module={data.module}
            capabilities={data.capabilities}
            style={style}
            me={me}
            sections={sections}
            activeSection={activeSection}
            progress={progress}
            estReadMinutes={data.estReadMinutes}
            courseLabel={courseLabel}
            listenOpen={listenOpen}
            onToggleListen={toggleListen}
            onJumpToLead={jumpToLead}
            sortingAnchorId={sortingAnchorId}
          />

          <article ref={articleRef} className="max-w-2xl">
            <div ref={headerRef}>
              <p className="label-utility flex items-center flex-wrap gap-x-2.5 gap-y-1.5">
                <span>{courseLabel} · Module {data.module.ordinal} · ~{data.estReadMinutes} min read</span>
                {data.capabilities.micro && (
                  <Link
                    to={`/module/${moduleId}/micro`}
                    className={`border rounded-full px-2.5 py-0.5 no-underline hover:border-ink-strong ${
                      essentials ? 'border-signal bg-signal/10 text-ink-strong' : 'border-line-strong text-accent'
                    }`}
                  >
                    {essentials ? 'You asked for short — the 2-min version' : '2-min version'}
                  </Link>
                )}
                {me?.prefs?.styles?.length ? (
                  <span className="border border-line-strong rounded-full px-2.5 py-0.5 text-muted">your style: {STYLE_LABELS[style]}</span>
                ) : null}
              </p>
              <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 tracking-tight">{data.module.title}</h1>
              <p className="text-muted mt-2">{data.module.blurb}</p>
              <ModuleLead
                module={data.module}
                capabilities={data.capabilities}
                style={style}
                me={me}
                mcp={data.mcp}
                listenOpen={listenOpen}
                sortingAnchorId={sortingAnchorId}
              />
            </div>

            <hr className="border-0 border-t border-line mt-8" />

            <div className="mt-2">
              {data.blocks.filter((b) => b.moduleId === moduleId).map((b) => (
                <Block key={b.id} block={b} moduleId={moduleId} openingFields={data.openingFields} openingValues={data.openingValues} />
              ))}
            </div>

            <footer className="mt-14">
              {data.capabilities.knowledgeCheck && (
                <div className="border border-ink-strong rounded-brand bg-surface p-6 sm:p-7">
                  <p className="label-utility">{style === 'quiz_first' ? 'Studied up?' : "You've reached the end of the read"}</p>
                  <h3 className="font-display font-semibold text-ink-strong text-2xl mt-2">
                    {style === 'quiz_first' ? 'Back to the quiz.' : "Finish the module — or prove you didn't need it."}
                  </h3>
                  <p className="text-sm text-ink mt-2 max-w-[52ch]">
                    The knowledge check closes this module: 60%+ clears anything it unlocks, misses point you at the exact lesson
                    to revisit. Retakes are free and unlimited.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-4">
                    <Link
                      to={`/module/${moduleId}/check`}
                      className="inline-flex items-center px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline"
                    >
                      Take the knowledge check
                    </Link>
                    {data.capabilities.chat && (
                      <Link to={tutorHref(me, moduleId)} className="text-accent font-semibold text-sm no-underline hover:underline">
                        Or discuss with the tutor first →
                      </Link>
                    )}
                  </div>
                </div>
              )}
              <p className="font-utility text-[0.7rem] text-muted mt-6">
                Concepts reviewed {data.stamps.conceptsReviewedAt ?? '—'} · Examples current as of {data.stamps.examplesCurrentAsOf ?? '—'}
              </p>
            </footer>
          </article>
        </div>
      </Screen>
    </>
  );
}
