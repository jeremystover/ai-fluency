import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Brand, MeResponse } from '../shared/types';
import { api } from './api';

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
