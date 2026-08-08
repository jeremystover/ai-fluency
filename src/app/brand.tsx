import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Brand, MeResponse } from '../shared/types';
import { api, track } from './api';

// ------------------------------------------------------------------
// Device awareness. One source of truth for "what is this person
// holding": pointer kind drives interactions (tap vs drag, which hints
// make sense), viewport drives layout decisions CSS can't make alone,
// and platform/browser go into the funnel so the operator knows what
// reviewers actually open this on.
// ------------------------------------------------------------------

export type Device = {
  coarse: boolean; // primary pointer is a finger — reshape interactions, hide keyboard hints
  small: boolean; // phone-width viewport (< 640px)
  platform: 'ios' | 'android' | 'desktop';
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'other';
};

function detectPlatform(): Device['platform'] {
  const ua = navigator.userAgent;
  // iPadOS masquerades as macOS; the touch check catches it.
  if (/iPhone|iPod/.test(ua) || (/Mac/.test(ua) && navigator.maxTouchPoints > 1) || /iPad/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

function detectBrowser(): Device['browser'] {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'edge';
  if (/Firefox\//.test(ua)) return 'firefox';
  if (/Chrome\/|CriOS\//.test(ua)) return 'chrome';
  if (/Safari\//.test(ua)) return 'safari';
  return 'other';
}

const mq = (q: string) => window.matchMedia(q);

export function deviceSnapshot(): Device {
  return {
    coarse: mq('(pointer: coarse)').matches,
    small: mq('(max-width: 639px)').matches,
    platform: detectPlatform(),
    browser: detectBrowser(),
  };
}

export function useDevice(): Device {
  const [device, setDevice] = useState<Device>(deviceSnapshot);
  useEffect(() => {
    const queries = [mq('(pointer: coarse)'), mq('(max-width: 639px)')];
    const onChange = () => setDevice(deviceSnapshot());
    for (const q of queries) q.addEventListener('change', onChange);
    return () => {
      for (const q of queries) q.removeEventListener('change', onChange);
    };
  }, []);
  return device;
}

type AppState = {
  brand: Brand | null;
  me: MeResponse | null;
  refreshMe: () => Promise<void>;
};

const Ctx = createContext<AppState>({ brand: null, me: null, refreshMe: async () => {} });

export const useApp = () => useContext(Ctx);

function applyTokens(brand: Brand) {
  const root = document.documentElement.style;
  for (const [key, value] of Object.entries(brand.tokens.color)) root.setProperty(`--c-${key}`, value);
  root.setProperty('--font-display', brand.tokens.fontDisplay);
  root.setProperty('--font-body', brand.tokens.fontBody);
  if (brand.tokens.fontUtility) root.setProperty('--font-utility', brand.tokens.fontUtility);
  root.setProperty('--radius', brand.tokens.radius);
  document.title = `AI Fluency · ${brand.name}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);

  const refreshMe = async () => {
    try {
      setMe(await api.get<MeResponse>('/api/me'));
    } catch {
      setMe({
        authenticated: false,
        progress: { intakeDone: false, diagnosticDone: false, sortDone: false, activityGraded: false, moduleCompleted: false },
      });
    }
  };

  useEffect(() => {
    api
      .get<Brand>('/api/brand')
      .then((b) => {
        applyTokens(b);
        setBrand(b);
      })
      .catch(() => {});
    refreshMe();
  }, []);

  // Device context into the funnel, once per authenticated page load — so the
  // operator report can say what reviewers actually open this on.
  useEffect(() => {
    if (!me?.authenticated) return;
    const d = deviceSnapshot();
    track('client_context', {
      viewportW: window.innerWidth,
      viewportH: window.innerHeight,
      dpr: window.devicePixelRatio,
      pointer: d.coarse ? 'coarse' : 'fine',
      platform: d.platform,
      browser: d.browser,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
    // Once per session per load state — me.authenticated flipping true is the signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.authenticated]);

  return <Ctx.Provider value={{ brand, me, refreshMe }}>{children}</Ctx.Provider>;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
