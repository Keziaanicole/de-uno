// Learning engine: level tracking, topic choice, spaced review. Pure functions over State.
import { LV, TOPIC, TOPICS, type Topic } from './content';

export const DAY = 864e5;

export type Skill = { m: number; seen: number; ivl: number; due: number; last?: number };
export type Mistake = { wrong: string; right: string; why: string; t: string };
export type State = {
  v: 1;
  placed: boolean;
  level: number; // 1.0 = A1 … 6.99 = C2
  skills: Record<string, Skill>;
  cardNo: number;
  soon: { id: string; at: number }[];
  recent: string[];
  mist: Mistake[];
  lastTopic: string;
  stats: { streak: number; lastDay: string; today: string; n: number; total: number; good: number; goal: number };
  updatedAt: number;
};

export const freshState = (): State => ({
  v: 1, placed: false, level: 1, skills: {}, cardNo: 0, soon: [], recent: [], mist: [], lastTopic: '',
  stats: { streak: 0, lastDay: '', today: '', n: 0, total: 0, good: 0, goal: 20 }, updatedAt: 0,
});

export type ExerciseType = 'translate' | 'respond' | 'transform' | 'complete' | 'describe';
export type Card = {
  topic: string;
  review: boolean;
  reason?: 'retry' | 'due' | 'mix' | 'chosen';
  type: ExerciseType;
  instruction: string;
  prompt: string;
  hint: string;
  answer: string;
  offline?: boolean;
};
export type Grade = {
  verdict: 'correct' | 'almost' | 'incorrect';
  score: number;
  corrected: string;
  mistakes: { wrong: string; right: string; why: string }[];
  better?: string;
  tip?: string;
  topics?: string[];
  cefr?: string;
  offline?: boolean;
};

// ---------- text helpers ----------
export const lvLabel = (x: number) => LV[Math.min(6, Math.max(1, Math.floor(x)))];
export const lvProgress = (x: number) => x - Math.floor(x);
export const todayStr = () => new Date().toISOString().slice(0, 10);
export const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
export const fold = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:"«»()]/g, ' ').replace(/\s+/g, ' ').trim();
export const mastery = (S: State, id: string) => S.skills[id]?.m ?? 0;

function lev(a: string, b: string) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let p = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const c = [i];
    for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    p = c;
  }
  return p[n];
}

/** Word diff: tokens of the learner's text (del = removed) and of the correction (ins = added). */
export type DiffTok = { w: string; mark?: 'del' | 'ins' };
export function diffWords(a: string, b: string): [DiffTok[], DiffTok[]] {
  const A = a.trim().split(/\s+/), B = b.trim().split(/\s+/);
  const k = (w: string) => w.toLowerCase().replace(/[.,;:!?¡¿"]/g, '');
  const L = Array.from({ length: A.length + 1 }, () => new Array<number>(B.length + 1).fill(0));
  for (let i = A.length - 1; i >= 0; i--)
    for (let j = B.length - 1; j >= 0; j--) L[i][j] = k(A[i]) === k(B[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const ua: DiffTok[] = [], cb: DiffTok[] = [];
  let i = 0, j = 0;
  while (i < A.length || j < B.length) {
    if (i < A.length && j < B.length && k(A[i]) === k(B[j])) { ua.push({ w: A[i] }); cb.push({ w: B[j] }); i++; j++; }
    else if (j < B.length && (i >= A.length || L[i][j + 1] >= L[i + 1][j])) { cb.push({ w: B[j], mark: 'ins' }); j++; }
    else { ua.push({ w: A[i], mark: 'del' }); i++; }
  }
  return [ua, cb];
}

// ---------- topic choice ----------
export function pickTopic(S: State, forceId?: string): Pick<Card, 'topic' | 'review' | 'reason'> {
  if (forceId) return { topic: forceId, review: false, reason: 'chosen' };
  const now = Date.now();
  S.cardNo++;
  const si = S.soon.findIndex((x) => x.at <= S.cardNo && x.id !== S.lastTopic);
  if (si >= 0) { const x = S.soon.splice(si, 1)[0]; return { topic: x.id, review: true, reason: 'retry' }; }
  const elig = TOPICS.filter((t) => t.lvl <= S.level + 0.6);
  const due = elig
    .filter((t) => { const k = S.skills[t.id]; return k && k.seen && k.due <= now && t.id !== S.lastTopic; })
    .sort((a, b) => S.skills[a.id].due - S.skills[b.id].due);
  if (due.length && (Math.random() < 0.35 || due.length > 4)) return { topic: due[0].id, review: true, reason: 'due' };
  const learning = elig
    .filter((t) => mastery(S, t.id) < 0.8 && t.id !== S.lastTopic)
    .sort((a, b) => a.lvl - b.lvl || mastery(S, a.id) - mastery(S, b.id));
  if (learning.length) { const pool = learning.slice(0, 3); return { topic: pool[Math.floor(Math.random() * pool.length)].id, review: false }; }
  const pool = elig.filter((t) => t.id !== S.lastTopic);
  return { topic: pool[Math.floor(Math.random() * pool.length)].id, review: true, reason: 'mix' };
}

export function chooseType(t: Topic): ExerciseType {
  const pool: ExerciseType[] = t.lvl <= 1 ? ['translate', 'translate', 'respond', 'describe'] : ['translate', 'respond', 'transform', 'complete', 'describe'];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function offlineCard(base: Pick<Card, 'topic' | 'review' | 'reason'>): Card {
  const t = TOPIC[base.topic];
  const [en, es] = t.fx[Math.floor(Math.random() * t.fx.length)];
  return { ...base, type: 'translate', instruction: 'Translate into Spanish', prompt: en, answer: es, hint: t.s, offline: true };
}

export function localGrade(c: Card, ans: string): Grade {
  const a = fold(ans), b = fold(c.answer);
  const dist = lev(a, b) / Math.max(a.length, b.length, 1);
  const strip = (s: string) => s.trim().replace(/[.!]$/, '').toLowerCase();
  const verdict = dist === 0 ? (strip(ans) === strip(c.answer) ? 'correct' : 'almost') : dist < 0.15 ? 'almost' : 'incorrect';
  return {
    verdict, score: Math.round((1 - dist) * 100), corrected: c.answer, mistakes: [], topics: [], offline: true,
    tip: verdict === 'correct' ? '¡Perfecto!' : 'Offline mode compares with one model answer, so other correct phrasings may be marked wrong.',
  };
}

export function normalizeGrade(r: Grade): Grade {
  if (!['correct', 'almost', 'incorrect'].includes(r.verdict)) r.verdict = r.score >= 85 ? 'correct' : r.score >= 60 ? 'almost' : 'incorrect';
  return r;
}

// ---------- updates ----------
function bumpStats(S: State, correct: boolean) {
  const st = S.stats, d = todayStr();
  if (st.today !== d) {
    const y = new Date(Date.now() - DAY).toISOString().slice(0, 10);
    st.streak = st.lastDay === y ? st.streak + 1 : 1;
    st.lastDay = d; st.today = d; st.n = 0;
  }
  st.n++; st.total++;
  if (correct) st.good++;
}

function weaken(S: State, ids: string[] | undefined, except: string, by: number) {
  (ids ?? []).forEach((id) => {
    if (!TOPIC[id] || id === except) return;
    const o = S.skills[id] ?? { m: 0.3, seen: 1, ivl: 0.5, due: 0 };
    o.m = Math.max(0, o.m - by); o.due = Date.now();
    S.skills[id] = o;
  });
}

export function applyResult(S: State, c: Card, r: Grade) {
  const now = Date.now(), q = Math.max(0, Math.min(100, Number(r.score) || 0)) / 100;
  const k = S.skills[c.topic] ?? { m: 0, seen: 0, ivl: 0, due: 0 };
  k.m = k.m + (q - k.m) * (k.seen < 3 ? 0.45 : 0.3); k.seen++; k.last = now;
  if (r.verdict === 'correct') { k.ivl = k.ivl ? Math.min(k.ivl * 2.3, 90) : 1; k.due = now + k.ivl * DAY; }
  else if (r.verdict === 'almost') { k.ivl = Math.max(0.3, (k.ivl || 1) * 0.6); k.due = now + k.ivl * DAY; S.soon.push({ id: c.topic, at: S.cardNo + 8 }); }
  else { k.ivl = 0.2; k.due = now + 20 * 6e4; S.soon.push({ id: c.topic, at: S.cardNo + 4 }); }
  S.skills[c.topic] = k;
  weaken(S, r.topics, c.topic, 0.06);
  const tl = TOPIC[c.topic].lvl;
  if (q >= 0.85) S.level += tl >= Math.floor(S.level) ? 0.035 : 0.01;
  else if (q < 0.5 && tl <= S.level) S.level -= 0.03;
  const ce = LV.indexOf(r.cefr ?? '');
  if (ce > 0) S.level = S.level * 0.98 + (ce + 0.5) * 0.02;
  S.level = Math.max(1, Math.min(6.95, S.level));
  (r.mistakes ?? []).slice(0, 3).forEach((m) => S.mist.unshift({ ...m, t: c.topic }));
  S.mist = S.mist.slice(0, 12);
  S.recent = [c.prompt, ...S.recent].slice(0, 12);
  S.soon = S.soon.slice(-12);
  bumpStats(S, r.verdict === 'correct');
}

export function applyRoleplay(S: State, text: string, r: { ok: boolean; corrected?: string; notes?: { why: string }[]; topics?: string[] }) {
  weaken(S, r.topics, '', 0.05);
  if (!r.ok && r.corrected) {
    S.mist.unshift({ wrong: text, right: r.corrected, why: r.notes?.[0]?.why || 'From roleplay', t: r.topics?.[0] ?? '' });
    S.mist = S.mist.slice(0, 12);
  } else if (r.ok) S.level = Math.min(6.95, S.level + 0.005);
}

export function finishPlacement(S: State, level: number) {
  S.level = Math.max(1, Math.min(6.9, level));
  S.placed = true;
  TOPICS.forEach((t, i) => {
    if (t.lvl < Math.floor(S.level)) S.skills[t.id] = { m: 0.65, seen: 1, ivl: 1, due: Date.now() + (i % 5) * DAY * 0.5, last: Date.now() };
  });
}

/** Local level estimate from placement scores: climb while each level's average holds. */
export function localPlacementLevel(res: { lvl: number; score: number }[]) {
  let local = 1;
  for (let l = 1; l <= 5; l++) {
    const xs = res.filter((x) => x.lvl === l);
    if (!xs.length) break;
    const avg = xs.reduce((a, x) => a + x.score, 0) / xs.length;
    local = l + Math.max(0, Math.min(1, (avg - 40) / 50)) * 0.95;
    if (avg < 60) break;
  }
  return local;
}

export type TopicStatus = 'done' | 'prog' | 'later' | 'new';
export function topicStatus(S: State, t: Topic): [TopicStatus, string] {
  const m = mastery(S, t.id);
  if (m >= 0.8) return ['done', 'Dominado'];
  if (S.skills[t.id]?.seen) return ['prog', 'En progreso'];
  if (t.lvl > S.level + 0.6) return ['later', 'Más adelante'];
  return ['new', 'Nuevo'];
}
