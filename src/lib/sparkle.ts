// Tiny event bus so any screen can trigger the champagne burst overlay.
export type Burst = { x: number; y: number; big?: boolean };
type Fn = (b: Burst) => void;
const subs = new Set<Fn>();
export const onBurst = (fn: Fn) => { subs.add(fn); return () => { subs.delete(fn); }; };
export const burst = (b: Burst) => subs.forEach((fn) => fn(b));
