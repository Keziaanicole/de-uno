// First launch: a short adaptive level check, typed in full sentences.
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSparkleOnLayout } from '../components/Feedback';
import { Button, Card, Loading, SpanishInput, Tag, s as ui } from '../components/ui';
import { errorText, tutor } from '../lib/ai';
import { LV, PLACEMENT } from '../lib/content';
import { isConfigured } from '../lib/supabase';
import { finishPlacement, localPlacementLevel, lvLabel, wordCount, type Grade } from '../lib/engine';
import { useStore } from '../lib/store';
import { C, F, GOLD_GRADIENT } from '../lib/theme';

type Res = { lvl: number; prompt: string; answer: string; score: number };

function Hero({ eyebrow, title, body, active, sparkle }: { eyebrow: string; title: string; body: string; active?: number; sparkle?: boolean }) {
  const spark = useSparkleOnLayout(!!sparkle, true);
  return (
    <LinearGradient colors={GOLD_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
      <Text style={styles.heroEyebrow}>{eyebrow}</Text>
      <View ref={spark.ref} onLayout={spark.onLayout} collapsable={false}>
        <Text style={styles.heroTitle}>{title}</Text>
      </View>
      <Text style={styles.heroBody}>{body}</Text>
      <View style={styles.cefr}>
        {LV.slice(1).map((l, i) => (
          <Text key={l} style={[styles.cefrCell, active === i + 1 && styles.cefrOn]}>{l}</Text>
        ))}
      </View>
    </LinearGradient>
  );
}

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const { update } = useStore();
  const [phase, setPhase] = useState<'intro' | 'test' | 'scoring' | 'result'>('intro');
  const [i, setI] = useState(0);
  const [res, setRes] = useState<Res[]>([]);
  const [ans, setAns] = useState('');
  const [busy, setBusy] = useState(false);
  const [nudge, setNudge] = useState('');
  const [summary, setSummary] = useState('');
  const [level, setLevel] = useState(1);

  const finish = async (all: Res[]) => {
    setPhase('scoring');
    const local = localPlacementLevel(all);
    let ai: { level: number; summary: string } | null = null;
    if (all.some((x) => x.answer)) {
      try { ai = await tutor('placement', { items: all }); } catch {}
    }
    const lvl = ai && Number(ai.level) ? (local + Number(ai.level)) / 2 : local;
    update((s) => finishPlacement(s, lvl));
    setLevel(lvl);
    setSummary(ai?.summary || 'De Uno will keep adjusting this as you practice. Every answer you type nudges it up or down.');
    setPhase('result');
  };

  const record = (item: (typeof PLACEMENT)[number], answer: string, score: number) => {
    const all = [...res, { lvl: item.lvl, prompt: item.prompt, answer, score }];
    setRes(all); setAns(''); setNudge('');
    const same = all.filter((x) => x.lvl === item.lvl);
    if ((same.length === 2 && same.every((x) => x.score < 55)) || i + 1 >= PLACEMENT.length) return finish(all);
    setI(i + 1);
  };

  const submit = async () => {
    const item = PLACEMENT[i], text = ans.trim();
    if (wordCount(text) < 3) { setNudge('Write a full sentence (at least a few words).'); return; }
    setBusy(true);
    try {
      const r = await tutor<Grade>('grade', {
        level: item.lvl, answer: text,
        exercise: { instruction: item.instruction, prompt: item.prompt, answer: '', topic: `general level check, ${LV[item.lvl]}` },
      });
      record(item, text, Number(r.score) || 0);
    } catch (e) { setNudge(errorText(e)); }
    setBusy(false);
  };

  const pick = (lvl: number) => { update((s) => finishPlacement(s, lvl)); onDone(); };

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      {phase === 'intro' && (
        <>
          <Hero eyebrow="Bienvenida" title="Spanish that keeps up with you."
            body="First, a short level check: up to 10 sentences you type yourself. After that, practice never ends. Open De Uno any time and the next card is waiting." />
          <View style={{ gap: 10, marginTop: 18 }}>
            {isConfigured ? (
              <Button label="Start the level check" onPress={() => setPhase('test')} />
            ) : (
              <Text style={[ui.body, ui.muted]}>The level check needs the AI tutor. Offline, pick your level instead:</Text>
            )}
            <Button kind="ghost" label="I'm a complete beginner" onPress={() => pick(1.1)} />
            {!isConfigured && (
              <View style={ui.row}>
                {[2, 3, 4, 5].map((l) => <Button key={l} kind="ghost" label={LV[l]} onPress={() => pick(l + 0.1)} style={{ flex: 1 }} />)}
              </View>
            )}
          </View>
        </>
      )}

      {phase === 'test' && (
        <>
          <View style={styles.steps}>
            {PLACEMENT.map((_, k) => <View key={k} style={[styles.step, k < i && { backgroundColor: C.goldHi }]} />)}
          </View>
          <Card>
            <Tag label={`Level check · ${i + 1} of ${PLACEMENT.length}`} />
            <Text style={styles.instr}>{PLACEMENT[i].instruction}</Text>
            <Text style={styles.prompt}>{PLACEMENT[i].prompt}</Text>
            <View style={{ marginTop: 16, gap: 10 }}>
              <SpanishInput value={ans} onChangeText={setAns} onSubmit={submit} placeholder="Escribe aquí tu respuesta…" editable={!busy}
                accessibilityLabel="Your answer" />
              {!!nudge && <Text style={ui.nudge}>{nudge}</Text>}
              {busy ? <Loading label="Reading your Spanish…" /> : (
                <View style={[ui.row, { justifyContent: 'space-between' }]}>
                  <Button kind="link" label="I don't know this yet" onPress={() => record(PLACEMENT[i], '', 0)} />
                  <Button label="Check" onPress={submit} />
                </View>
              )}
            </View>
          </Card>
        </>
      )}

      {phase === 'scoring' && <Card><Loading label="Working out your level…" /></Card>}

      {phase === 'result' && (
        <>
          <Hero eyebrow="Tu nivel" title={`You're at ${lvLabel(level)}.`} body={summary} active={Math.floor(level)} sparkle />
          <Button label="Start practicing" onPress={onDone} style={{ marginTop: 18 }} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 220 },
  hero: { borderRadius: 26, padding: 22 },
  heroEyebrow: { fontFamily: F.bodyBold, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: C.onGold, opacity: 0.7 },
  heroTitle: { fontFamily: F.display, fontSize: 34, lineHeight: 39, color: C.onGold, marginTop: 4 },
  heroBody: { fontFamily: F.body, fontSize: 16, lineHeight: 23, color: C.onGold, marginTop: 8 },
  cefr: { flexDirection: 'row', gap: 4, marginTop: 16 },
  cefrCell: { flex: 1, textAlign: 'center', fontFamily: F.display, fontSize: 13, color: C.onGold, paddingVertical: 6, borderRadius: 9, overflow: 'hidden', backgroundColor: 'rgba(26,18,12,0.14)' },
  cefrOn: { backgroundColor: C.onGold, color: C.goldHi },
  steps: { flexDirection: 'row', gap: 5, marginBottom: 12 },
  step: { flex: 1, height: 5, borderRadius: 5, backgroundColor: C.surface2 },
  instr: { fontFamily: F.bodySemi, fontSize: 15, color: C.muted, marginTop: 14 },
  prompt: { fontFamily: F.displayMedium, fontSize: 26, lineHeight: 32, color: C.ink, marginTop: 6 },
});
