import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../brand';
import { Screen, Button } from '../components/ui';
import { track } from '../api';

export default function Landing() {
  const { brand, me } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    track('landed');
  }, []);

  return (
    <Screen>
      <div className="pt-16 sm:pt-24">
        <p className="label-utility anim-fade">AI Fluency for People Leaders</p>
        <h1 className="font-display font-bold text-ink-strong text-4xl sm:text-5xl leading-[1.08] tracking-tight mt-4 anim-rise">
          You already use AI.
          <br />
          This measures whether you can trust your read on it.
        </h1>
        <p className="text-lg text-ink mt-6 max-w-xl anim-rise" style={{ animationDelay: '120ms' }}>
          Nine questions. Most people discover they're wrong about what these tools can do — and the <em>direction</em> they're
          wrong in says more about their risk than any quiz score. Then Module 1 closes the gap.
        </p>
        <div className="mt-10 anim-rise" style={{ animationDelay: '220ms' }}>
          <Button onClick={() => navigate(!me?.authenticated ? '/enter' : me.progress.intakeDone ? '/plan' : '/welcome')}>
            {me?.authenticated ? 'Continue' : 'Enter with your passcode'}
          </Button>
        </div>
        <div className="mt-16 border-t border-line pt-5 flex flex-col gap-1.5 anim-fade" style={{ animationDelay: '350ms' }}>
          <span className="label-utility">What's inside</span>
          <p className="text-sm text-muted max-w-lg">
            A calibration diagnostic scored against field data · Module 1 of the eight-module AI 101 course · an applied
            activity graded by AI against a four-dimension rubric, with unlimited resubmission.
          </p>
          {brand && <p className="text-sm text-muted">{brand.voice.greeting}</p>}
        </div>
      </div>
    </Screen>
  );
}
