// Endless practice: one typed sentence at a time, no modules, leave whenever.
import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Feedback from '../components/Feedback';
import { Button, Card, Loading, Meter, SpanishInput, T, Tag, s as ui } from '../components/ui';
import { errorText, tutor } from '../lib/ai';
import { LV, TOPIC } from '../lib/content';
import {
  applyResult, chooseType, localGrade, lvLabel, normalizeGrade, offlineCard, pickTopic, todayStr, wordCount,
  type Card as CardT, type Grade, type State,
} from '../lib/engine';
import { useStore } from '../lib/store';
import { C, F } from '../lib/theme';

const REASON: Record<string, string> = {
  retry: 'Repaso · you missed this earlier',
  due: 'Repaso · time to review',
  mix: 'Repaso · keeping it fresh',
  chosen: 'Chosen topic',
};

async function makeCard(S: State, forceId?: string): Promise<CardT> {
  const base = pickTopic(S, forceId);
  S.lastTopic = base.topic;
  const t = TOPIC[base.topic];
  const type = chooseType(t);
  try {
    const r = await tutor<{ instruction: string; prompt: string; hint: string; answer: string }>('generate', {
      level: S.level, topic: { t: t.t, s: t.s, lvl: t.lvl }, type,
      mistakes: S.mist.slice(0, 4).map((m) => `${m.wrong} → ${m.right}`), recent: S.recent.slice(0, 8),
    });
    return { ...base, type, ...r };
  } catch (e) {
    if ((e as { code?: string }).code === 'offline') return offlineCard(base);
    throw e;
  }
}

export default function Practice({ focusTopic, onFocusHandled, onOpenTopic }: {
  focusTopic: string | null; onFocusHandled: () => void; onOpenTopic: (id: string) => void;
}) {
  const { S, update } = useStore();
  const [card, setCard] = useState<CardT | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ans, setAns] = useState('');
  const [nudge, setNudge] = useState('');
  const [busy, setBusy] = useState(false);
  const [fb, setFb] = useState<{ ans: string; r: Grade } | null>(null);
  const next = useRef<Promise<CardT | null> | null>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);

  const advance = useCallback(async (forceId?: string) => {
    setFb(null); setAns(''); setNudge(''); setError(null); setCard(null);
    let c: CardT | null = null;
    if (!forceId && next.current) { c = await next.current; next.current = null; }
    if (!c) {
      try { c = await makeCard(S, forceId); } catch (e) { setError(errorText(e)); return; }
    }
    update(() => {}); // persist cardNo / lastTopic changes
    setCard(c);
  }, [S, update]);

  useEffect(() => {
    if (focusTopic) { onFocusHandled(); next.current = null; advance(focusTopic); }
    else if (!card && !error) advance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTopic]);

  const check = async () => {
    if (!card || busy) return;
    const text = ans.trim();
    if (wordCount(text) < 3) { setNudge('De Uno wants a full sentence. Try writing at least a few words.'); return; }
    setBusy(true); setNudge('');
    try {
      const r = normalizeGrade(card.offline ? localGrade(card, text) : await tutor<Grade>('grade', {
        level: S.level,
        exercise: { instruction: card.instruction, prompt: card.prompt, answer: card.answer, topic: TOPIC[card.topic].t },
        answer: text,
      }));
      update((s) => applyResult(s, card, r));
      setFb({ ans: text, r });
      next.current = makeCard(S).catch(() => null); // prefetch while they read the feedback
      setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 150);
    } catch (e) {
      setNudge(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  const st = S.stats, n = st.today === todayStr() ? st.n : 0, goal = st.goal || 20;
  const t = card ? TOPIC[card.topic] : null;

  return (
    <ScrollView ref={scroll} contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive">
      <View style={styles.daybar}>
        <Meter value={n / goal} height={8} />
        <Text style={styles.dayText}>{n} / {goal} today{n >= goal ? ' · goal met' : ''}</Text>
      </View>

      <Card>
        {error ? (
          <View style={{ gap: 12 }}>
            <Text style={ui.nudge}>{error}</Text>
            <Button label="Try again" onPress={() => advance()} style={{ alignSelf: 'flex-start' }} />
          </View>
        ) : !card || !t ? (
          <Loading label="Preparing your next sentence…" />
        ) : (
          <>
            <View style={ui.row}>
              <Tag label={card.reason ? REASON[card.reason] : 'Nuevo'} highlight={card.review} />
              <Tag label={`${t.t} · ${LV[t.lvl]}`} onPress={() => onOpenTopic(t.id)} />
            </View>
            <Text style={styles.instr}>{card.instruction}</Text>
            <Text style={styles.prompt}>{card.prompt}</Text>
            {!fb ? (
              <View style={{ marginTop: 16, gap: 10 }}>
                {!!card.hint && <T style={[ui.muted, { fontSize: 14 }]}>Hint: {card.hint}</T>}
                <SpanishInput value={ans} onChangeText={setAns} onSubmit={check} placeholder="Escribe una frase completa…"
                  accessibilityLabel="Your answer in Spanish" editable={!busy} />
                {!!nudge && <Text style={ui.nudge}>{nudge}</Text>}
                {busy ? <Loading label="Checking your sentence…" /> : (
                  <View style={[ui.row, { justifyContent: 'space-between' }]}>
                    <Button kind="link" label="Skip" onPress={() => { update((s) => { s.soon.push({ id: card.topic, at: s.cardNo + 6 }); }); advance(); }} />
                    <Button label="Check" onPress={check} />
                  </View>
                )}
              </View>
            ) : (
              <>
                <Feedback ans={fb.ans} r={fb.r} card={card} />
                <View style={[ui.row, { justifyContent: 'space-between', marginTop: 14 }]}>
                  <Button kind="link" label="Review this grammar" onPress={() => onOpenTopic(card.topic)} />
                  <Button label="Next sentence" onPress={() => advance()} />
                </View>
              </>
            )}
          </>
        )}
      </Card>
      {card?.offline && (
        <Text style={styles.foot}>Offline mode: built-in sentences, compared with one model answer.</Text>
      )}
      <Text style={styles.foot}>No lessons to finish. Leave whenever you like; your place is saved. Level {lvLabel(S.level)}.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 220, gap: 12 },
  daybar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  dayText: { fontFamily: F.bodySemi, fontSize: 13, color: C.muted },
  instr: { fontFamily: F.bodySemi, fontSize: 15, color: C.muted, marginTop: 14 },
  prompt: { fontFamily: F.displayMedium, fontSize: 26, lineHeight: 32, color: C.ink, marginTop: 6 },
  foot: { fontFamily: F.body, fontSize: 13, color: C.muted, textAlign: 'center' },
});
