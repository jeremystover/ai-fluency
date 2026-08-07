import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ContentBlock } from '../../shared/types';
import { Screen, Markdown, ErrorNote } from '../components/ui';
import { api, ApiError, track } from '../api';

type MicroData = { blocks: ContentBlock[]; stamps: { conceptsReviewedAt: string | null; examplesCurrentAsOf: string | null } };

export default function MicroView() {
  const [data, setData] = useState<MicroData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<MicroData>('/api/module/ai101-m1/micro')
      .then((d) => {
        setData(d);
        track('module_opened', { moduleId: 'ai101-m1-micro' });
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : 'The micro dose did not load. Reload to try again.'));
  }, []);

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!data) return <Screen><div className="pt-24 text-center"><p className="label-utility">Loading…</p></div></Screen>;

  return (
    <Screen>
      <div className="pt-10 sm:pt-14">
        <p className="label-utility">AI 101 · Module 1 · micro dose · 2 min read</p>
        {data.blocks.map((b) =>
          b.kind === 'callout' ? (
            <div key={b.id} className="border-l-4 border-signal bg-signal/10 rounded-r-brand p-5 my-5">
              <Markdown source={b.body} className="text-[0.95rem] [&_h3]:mt-0" />
            </div>
          ) : (
            <Markdown key={b.id} source={b.body} />
          ),
        )}
        <div className="mt-8 border border-line rounded-brand bg-surface p-5 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm text-ink">
            That's the two-minute version. The full module adds the mechanism, the vocabulary, and the exercises.
          </p>
          <span className="flex items-center gap-4 shrink-0">
            <Link to="/module/1" className="text-accent text-sm font-semibold no-underline hover:underline">Full module →</Link>
            <Link to="/plan" className="text-muted text-sm no-underline hover:text-ink-strong">Back to your plan</Link>
          </span>
        </div>
        <footer className="mt-8 border-t border-line pt-4">
          <span className="font-utility text-[0.7rem] text-muted">
            Concepts reviewed {data.stamps.conceptsReviewedAt ?? '—'}
            {data.stamps.examplesCurrentAsOf ? ` · Examples current as of ${data.stamps.examplesCurrentAsOf}` : ''}
          </span>
        </footer>
      </div>
    </Screen>
  );
}
