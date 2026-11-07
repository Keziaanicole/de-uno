// App-wide state: the signed-in session plus the learner's progress.
// Progress is cached on the device and synced to the `profiles` table.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { freshState, type State } from './engine';
import { isConfigured, supabase } from './supabase';

type Store = {
  session: Session | null;
  /** Offline try-out: no account, progress kept on this device only. */
  guest: boolean;
  startGuest: () => void;
  authReady: boolean;
  loaded: boolean;
  S: State;
  /** Mutate progress, then re-render and save. */
  update: (fn: (s: State) => void) => void;
  reset: () => void;
  signOut: () => Promise<void>;
};

const Ctx = createContext<Store | null>(null);
const cacheKey = (uid: string) => `deuno.state.${uid}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!isConfigured);
  const [loaded, setLoaded] = useState(false);
  const [guest, setGuest] = useState(false);
  const [, setTick] = useState(0);
  const S = useRef<State>(freshState());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uid = session?.user.id ?? (guest ? 'guest' : undefined);

  useEffect(() => {
    if (!isConfigured) return;
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  // Load progress: device cache first, then the server copy if it is newer.
  useEffect(() => {
    if (!uid) { setLoaded(false); return; }
    let live = true;
    (async () => {
      let local = freshState();
      try {
        const raw = await AsyncStorage.getItem(cacheKey(uid));
        if (raw) local = { ...freshState(), ...JSON.parse(raw) };
      } catch {}
      if (live) { S.current = local; setLoaded(true); setTick((t) => t + 1); }
      if (uid === 'guest') return;
      const { data } = await supabase.from('profiles').select('state').eq('user_id', uid).maybeSingle();
      const remote = data?.state as State | undefined;
      if (live && remote && (remote.updatedAt ?? 0) > (S.current.updatedAt ?? 0)) {
        S.current = { ...freshState(), ...remote };
        setTick((t) => t + 1);
      }
    })();
    return () => { live = false; };
  }, [uid]);

  const persist = useCallback(() => {
    if (!uid) return;
    S.current.updatedAt = Date.now();
    const snapshot = S.current;
    AsyncStorage.setItem(cacheKey(uid), JSON.stringify(snapshot)).catch(() => {});
    if (uid === 'guest') return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase.from('profiles').upsert({ user_id: uid, state: snapshot, updated_at: new Date().toISOString() }).then(() => {});
    }, 1500);
  }, [uid]);

  const update = useCallback((fn: (s: State) => void) => {
    fn(S.current);
    persist();
    setTick((t) => t + 1);
  }, [persist]);

  const reset = useCallback(() => { S.current = freshState(); persist(); setTick((t) => t + 1); }, [persist]);
  const signOut = useCallback(async () => { setGuest(false); if (isConfigured) await supabase.auth.signOut(); }, []);
  const startGuest = useCallback(() => setGuest(true), []);

  // Rebuilt on every render on purpose: progress lives in a ref and changes in place.
  const value: Store = { session, guest, startGuest, authReady, loaded, S: S.current, update, reset, signOut };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be used inside StoreProvider');
  return v;
}
