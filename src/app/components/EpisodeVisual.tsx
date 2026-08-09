// The episode's visual: one idea from the content, drawn as a small hand-drawn
// chart in the spirit of witty workplace comics (think Fosslien & West Duffy) —
// wobbly strokes, handwritten labels, one accent color, a wry point. Five
// shapes, all deterministic SVG layouts styled from brand tokens; the model
// picks the shape that matches the idea's actual structure.
import { useId } from 'react';
import type { PodcastVisual } from '../../shared/types';
import '@fontsource/caveat/700.css';

const HAND = "'Caveat', 'Comic Sans MS', cursive";
const STROKE = 'var(--c-ink-strong)';

// Split a short label into at most two text lines.
function splitLabel(label: string, max = 16): string[] {
  if (label.length <= max) return [label];
  const words = label.split(' ');
  let first = '';
  let i = 0;
  while (i < words.length && (first ? `${first} ${words[i]}` : words[i]).length <= max) {
    first = first ? `${first} ${words[i]}` : words[i];
    i++;
  }
  if (!first) return [label.slice(0, max), label.slice(max)];
  return [first, words.slice(i).join(' ')].filter(Boolean);
}

function Label({
  x,
  y,
  lines,
  size = 19,
  fill = STROKE,
  weight = 700,
  anchor = 'middle',
  halo = false,
}: {
  x: number;
  y: number;
  lines: string[];
  size?: number;
  fill?: string;
  weight?: number;
  anchor?: 'middle' | 'start' | 'end';
  halo?: boolean;
}) {
  const lh = size * 0.92;
  const y0 = y - ((lines.length - 1) * lh) / 2;
  return (
    <>
      {lines.map((ln, j) => (
        <text
          key={j}
          x={x}
          y={y0 + j * lh}
          textAnchor={anchor}
          dominantBaseline="middle"
          fontFamily={HAND}
          fontSize={size}
          fontWeight={weight}
          fill={fill}
          {...(halo ? { stroke: 'var(--c-surface)', strokeWidth: 5, paintOrder: 'stroke' as const } : {})}
        >
          {ln}
        </text>
      ))}
    </>
  );
}

// The wobble: a turbulence-displacement filter applied to strokes (never to
// text — crisp handwriting over wobbly ink is the look). One filter per SVG
// instance via useId so multiple visuals on a page don't collide.
function useHand() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const filterId = `hand-${id}`;
  const arrowId = `arr-${id}`;
  const defs = (
    <defs>
      <filter id={filterId} x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="4" />
      </filter>
      <marker id={arrowId} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" />
      </marker>
    </defs>
  );
  return { defs, hand: `url(#${filterId})`, arrow: `url(#${arrowId})` };
}

const box = { fill: 'var(--c-surface)', stroke: STROKE, strokeWidth: 1.7 };

function HubSketch({ visual }: { visual: PodcastVisual }) {
  const { defs, hand } = useHand();
  const spokes = visual.spokes ?? [];
  const links = visual.links ?? [];
  const W = 660;
  const H = 400;
  const cx = W / 2;
  const cy = H / 2;
  const pos = spokes.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / spokes.length;
    return { x: cx + Math.cos(angle) * 240, y: cy + Math.sin(angle) * 145 };
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto mt-2" role="img" aria-label={`Diagram: ${visual.hub}`}>
      {defs}
      <g filter={hand}>
        {links.map((l, i) => (
          <line key={`l${i}`} x1={pos[l.from].x} y1={pos[l.from].y} x2={pos[l.to].x} y2={pos[l.to].y} stroke={STROKE} strokeWidth={1.3} strokeDasharray="6 5" />
        ))}
        {pos.map((p, i) => (
          <line key={`e${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={STROKE} strokeWidth={1.4} />
        ))}
        {pos.map((p, i) => (
          <rect key={`n${i}`} x={p.x - 68} y={p.y - 26} width={136} height={52} rx={12} {...box} transform={`rotate(${i % 2 ? 1.2 : -1.1} ${p.x} ${p.y})`} />
        ))}
        <ellipse cx={cx} cy={cy} rx={86} ry={44} fill="var(--c-accent)" />
      </g>
      {links.map((l, i) =>
        l.label ? (
          <Label key={`ll${i}`} x={(pos[l.from].x + pos[l.to].x) / 2} y={(pos[l.from].y + pos[l.to].y) / 2} lines={[l.label]} size={16} weight={400} fill="var(--c-muted)" halo />
        ) : null,
      )}
      {pos.map((p, i) =>
        spokes[i].relation ? (
          <Label key={`r${i}`} x={(cx + p.x) / 2} y={(cy + p.y) / 2} lines={[spokes[i].relation]} size={16} weight={400} fill="var(--c-muted)" halo />
        ) : null,
      )}
      {pos.map((p, i) => (
        <Label key={`t${i}`} x={p.x} y={p.y} lines={splitLabel(spokes[i].label)} />
      ))}
      <Label x={cx} y={cy} lines={splitLabel(visual.hub ?? '', 13)} size={21} fill="var(--c-on-accent)" />
    </svg>
  );
}

function FlowSketch({ visual }: { visual: PodcastVisual }) {
  const { defs, hand, arrow } = useHand();
  const steps = visual.steps ?? [];
  const n = steps.length;
  const BOX_W = 128;
  const GAP = 62;
  const W = n * BOX_W + (n - 1) * GAP + 24;
  const H = 150;
  const y = H / 2 + 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto mt-2" role="img" aria-label="Process diagram">
      {defs}
      <g filter={hand}>
        {steps.map((_, i) => {
          const x = 12 + i * (BOX_W + GAP);
          return i < n - 1 ? (
            <line key={`a${i}`} x1={x + BOX_W + 3} y1={y} x2={x + BOX_W + GAP - 6} y2={y} stroke={STROKE} strokeWidth={1.6} markerEnd={arrow} />
          ) : null;
        })}
        {steps.map((_, i) => {
          const x = 12 + i * (BOX_W + GAP);
          const last = i === n - 1;
          return (
            <rect
              key={`b${i}`}
              x={x}
              y={y - 29}
              width={BOX_W}
              height={58}
              rx={12}
              fill={last ? 'var(--c-accent)' : 'var(--c-surface)'}
              stroke={last ? 'var(--c-accent)' : STROKE}
              strokeWidth={1.7}
              transform={`rotate(${i % 2 ? 1 : -1} ${x + BOX_W / 2} ${y})`}
            />
          );
        })}
      </g>
      {steps.map((st, i) => {
        const x = 12 + i * (BOX_W + GAP);
        return i < n - 1 && st.arrow ? (
          <Label key={`al${i}`} x={x + BOX_W + GAP / 2} y={y - 26} lines={[st.arrow]} size={16} weight={400} fill="var(--c-muted)" halo />
        ) : null;
      })}
      {steps.map((st, i) => {
        const x = 12 + i * (BOX_W + GAP);
        return <Label key={`t${i}`} x={x + BOX_W / 2} y={y} lines={splitLabel(st.label, 13)} size={18} fill={i === n - 1 ? 'var(--c-on-accent)' : STROKE} />;
      })}
    </svg>
  );
}

function LadderSketch({ visual }: { visual: PodcastVisual }) {
  const { defs, hand, arrow } = useHand();
  const rungs = visual.rungs ?? [];
  const n = rungs.length;
  const ROW = 72;
  const W = 660;
  const H = n * ROW + 30;
  const BOX_X = 96;
  const BOX_W = 220;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto mt-2" role="img" aria-label="Ladder diagram">
      {defs}
      <g filter={hand}>
        <line x1={54} y1={H - 18} x2={54} y2={16} stroke={STROKE} strokeWidth={1.6} markerEnd={arrow} />
        {rungs.map((_, i) => {
          const yMid = H - 15 - i * ROW - ROW / 2 + 6;
          const top = i === n - 1;
          return (
            <rect
              key={`b${i}`}
              x={BOX_X}
              y={yMid - 27}
              width={BOX_W}
              height={54}
              rx={12}
              fill={top ? 'var(--c-accent)' : 'var(--c-surface)'}
              stroke={top ? 'var(--c-accent)' : STROKE}
              strokeWidth={1.7}
              transform={`rotate(${i % 2 ? 0.9 : -0.8} ${BOX_X + BOX_W / 2} ${yMid})`}
            />
          );
        })}
      </g>
      {rungs.map((r, i) => {
        const yMid = H - 15 - i * ROW - ROW / 2 + 6;
        return (
          <g key={`t${i}`}>
            <Label x={BOX_X + BOX_W / 2} y={yMid} lines={splitLabel(r.label, 20)} size={18} fill={i === n - 1 ? 'var(--c-on-accent)' : STROKE} />
            {r.note && <Label x={BOX_X + BOX_W + 18} y={yMid} lines={splitLabel(r.note, 34)} size={16} weight={400} fill="var(--c-muted)" anchor="start" />}
          </g>
        );
      })}
    </svg>
  );
}

function QuadSketch({ visual }: { visual: PodcastVisual }) {
  const { defs, hand, arrow } = useHand();
  const axes = visual.axes!;
  const quadrants = visual.quadrants ?? [];
  const W = 660;
  const H = 430;
  const cx = W / 2;
  const cy = H / 2;
  const halfW = 250;
  const halfH = 150;
  // quadrant label centers: TL, TR, BL, BR
  const centers = [
    { x: cx - halfW / 2, y: cy - halfH / 2 - 8 },
    { x: cx + halfW / 2, y: cy - halfH / 2 - 8 },
    { x: cx - halfW / 2, y: cy + halfH / 2 + 4 },
    { x: cx + halfW / 2, y: cy + halfH / 2 + 4 },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto mt-2" role="img" aria-label="Two-by-two diagram">
      {defs}
      <g filter={hand}>
        <line x1={cx - halfW} y1={cy} x2={cx + halfW} y2={cy} stroke={STROKE} strokeWidth={1.6} markerEnd={arrow} />
        <line x1={cx} y1={cy + halfH} x2={cx} y2={cy - halfH} stroke={STROKE} strokeWidth={1.6} markerEnd={arrow} />
        {visual.star !== undefined && centers[visual.star] && (
          <ellipse cx={centers[visual.star].x} cy={centers[visual.star].y} rx={104} ry={46} fill="none" stroke="var(--c-accent)" strokeWidth={2.6} />
        )}
      </g>
      <Label x={cx + halfW + 8} y={cy + 20} lines={splitLabel(axes.xHigh, 16)} size={16} weight={400} fill="var(--c-muted)" anchor="end" />
      <Label x={cx - halfW} y={cy + 20} lines={splitLabel(axes.xLow, 16)} size={16} weight={400} fill="var(--c-muted)" anchor="start" />
      <Label x={cx + 10} y={cy - halfH + 4} lines={splitLabel(axes.yHigh, 16)} size={16} weight={400} fill="var(--c-muted)" anchor="start" />
      <Label x={cx + 10} y={cy + halfH - 6} lines={splitLabel(axes.yLow, 16)} size={16} weight={400} fill="var(--c-muted)" anchor="start" />
      {centers.map((c, i) => (
        <Label key={i} x={c.x} y={c.y} lines={splitLabel(quadrants[i] ?? '', 18)} size={19} fill={visual.star === i ? 'var(--c-accent)' : STROKE} />
      ))}
    </svg>
  );
}

function VennSketch({ visual }: { visual: PodcastVisual }) {
  const { defs, hand } = useHand();
  const circles = visual.circles ?? [];
  const W = 660;
  const H = 380;
  const cy = H / 2;
  const r = 128;
  const off = 76;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto mt-2" role="img" aria-label="Venn diagram">
      {defs}
      <g filter={hand}>
        <circle cx={W / 2 - off} cy={cy} r={r} fill="var(--c-accent)" fillOpacity={0.1} stroke={STROKE} strokeWidth={1.7} />
        <circle cx={W / 2 + off} cy={cy} r={r} fill="var(--c-accent)" fillOpacity={0.1} stroke={STROKE} strokeWidth={1.7} />
      </g>
      <Label x={W / 2 - off - r / 2 - 6} y={cy} lines={splitLabel(circles[0]?.label ?? '', 14)} />
      <Label x={W / 2 + off + r / 2 + 6} y={cy} lines={splitLabel(circles[1]?.label ?? '', 14)} />
      <Label x={W / 2} y={cy} lines={splitLabel(visual.overlap ?? '', 11)} size={20} fill="var(--c-accent)" halo />
    </svg>
  );
}

export default function VisualCard({ visual }: { visual: PodcastVisual }) {
  const shape = visual.shape ?? 'hub';
  const sketch =
    shape === 'flow' && visual.steps?.length ? (
      <FlowSketch visual={visual} />
    ) : shape === 'ladder' && visual.rungs?.length ? (
      <LadderSketch visual={visual} />
    ) : shape === 'quad' && visual.axes && visual.quadrants?.length === 4 ? (
      <QuadSketch visual={visual} />
    ) : shape === 'venn' && visual.circles?.length === 2 && visual.overlap ? (
      <VennSketch visual={visual} />
    ) : visual.hub && visual.spokes?.length ? (
      <HubSketch visual={visual} />
    ) : null;
  if (!sketch) return null;
  return (
    <div className="border border-line rounded-brand bg-surface p-5 mt-5">
      <p className="label-utility">Sketch{visual.title ? ` · ${visual.title}` : ''}</p>
      {sketch}
      {visual.insight && (
        <p className="text-sm text-ink mt-2 border-l-4 border-signal pl-3">
          <span className="font-display font-semibold text-ink-strong">What to see: </span>
          {visual.insight}
        </p>
      )}
    </div>
  );
}
