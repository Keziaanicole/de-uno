// Roleplay: a scene partner who speaks at your level and corrects every message.
import { useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { DiffText, useSparkleOnLayout } from '../components/Feedback';
import { Button, Card, Eyebrow, H, Loading, SpanishInput, T, s as ui } from '../components/ui';
import { errorText, tutor } from '../lib/ai';
import { LV, SCENARIOS, type Scenario } from '../lib/content';
import { applyRoleplay, diffWords, lvLabel, wordCount } from '../lib/engine';
import { useStore } from '../lib/store';
import { isConfigured } from '../lib/supabase';
import { C, F, GOLD_GRADIENT } from '../lib/theme';
import { LinearGradient } from 'expo-linear-gradient';

type Corr = { ok: boolean; corrected: string; notes: { why: string }[] };
type Msg = { who: 'ai' | 'me'; text: string; en?: string; c?: Corr };
type Turn = Corr & { topics: string[]; reply: string; en: string };

function AiBubble({ m }: { m: Msg }) {
  const [show, setShow] = useState(false);
  return (
    <Pressable onPress={() => setShow((v) => !v)} style={[styles.msg, styles.ai]} accessibilityHint="Shows the English translation">
      <T>{m.text}</T>
      {show ? <T style={styles.tr}>{m.en}</T> : !!m.en && <T style={styles.tr}>Tap to translate</T>}
    </Pressable>
  );
}

function Correction({ m }: { m: Msg }) {
  const spark = useSparkleOnLayout(!!m.c?.ok);
  if (!m.c) return null;
  if (m.c.ok)
    return (
      <View ref={spark.ref} onLayout={spark.onLayout} collapsable={false} style={[styles.corr, { backgroundColor: '#251d12', borderColor: C.gold, borderWidth: 1 }]}>
        <Text style={{ fontFamily: F.bodySemi, color: C.goldHi, fontSize: 14 }}>Natural and correct.</Text>
      </View>
    );
  return (
    <View style={[styles.corr, { backgroundColor: C.warnBg }]}>
      <Text style={{ fontFamily: F.bodyBold, color: C.warn, fontSize: 13 }}>Better:</Text>
      <DiffText toks={diffWords(m.text, m.c.corrected || m.text)[1]} style={{ fontSize: 15 }} />
      {m.c.notes.length > 0 && <T style={[ui.muted, { fontSize: 13 }]}>{m.c.notes.map((n) => n.why).join(' · ')}</T>}
    </View>
  );
}

export default function Roleplay() {
  const { S, update } = useStore();
  const [scen, setScen] = useState<Scenario | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [text, setText] = useState('');
  const [custom, setCustom] = useState('');
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);

  const start = async (sc: Scenario) => {
    setScen(sc); setMsgs([]); setErr(''); setBusy(true);
    try {
      const r = await tutor<{ reply: string; en: string }>('rp_open', { level: S.level, scen: { t: sc.t, s: sc.s, role: sc.role } });
      setMsgs([{ who: 'ai', text: r.reply, en: r.en }]);
    } catch (e) { setErr(errorText(e)); }
    setBusy(false);
  };

  const send = async () => {
    const body = text.trim();
    if (!scen || busy) return;
    if (wordCount(body) < 3) { setErr('Reply with a full sentence, not just a word or two.'); return; }
    const mine: Msg = { who: 'me', text: body };
    const history = [...msgs, mine];
    setMsgs(history); setText(''); setErr(''); setBusy(true);
    try {
      const r = await tutor<Turn>('rp_turn', {
        level: S.level, scen: { t: scen.t, s: scen.s, role: scen.role },
        transcript: history.slice(-14).map((m) => ({ who: m.who, text: m.text })),
      });
      mine.c = { ok: r.ok, corrected: r.corrected, notes: r.notes ?? [] };
      setMsgs([...history, { who: 'ai', text: r.reply, en: r.en }]);
      update((s) => applyRoleplay(s, body, r));
    } catch (e) { setErr(errorText(e)); }
    setBusy(false);
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 120);
  };

  if (!scen)
    return (
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Eyebrow>Rol</Eyebrow>
        <H size={30} style={{ marginTop: 4 }}>Talk it through</H>
        <T style={[ui.muted, { fontSize: 14, marginTop: 6 }]}>
          Pick a scene. Your partner speaks at your level ({lvLabel(S.level)}) and corrects each message you type.
        </T>
        {!isConfigured && <Card style={{ marginTop: 12 }}><T style={ui.muted}>Roleplay needs the AI tutor, which turns on once the server is connected.</T></Card>}
        <View style={styles.grid}>
          {SCENARIOS.map((sc) => (
            <Pressable key={sc.id} onPress={() => start(sc)} accessibilityRole="button"
              style={({ pressed }) => [styles.scen, pressed && { borderColor: C.gold }]}>
              <Text style={styles.scenLv}>{LV[sc.lvl]}+</Text>
              <Text style={styles.scenT}>{sc.t}</Text>
              <Text style={styles.scenS}>{sc.s}</Text>
            </Pressable>
          ))}
        </View>
        <Card style={{ marginTop: 14, gap: 10 }}>
          <Text style={{ fontFamily: F.bodyBold, color: C.ink, fontSize: 16 }}>Or invent your own scene</Text>
          <TextInput value={custom} onChangeText={setCustom} multiline placeholder="e.g. Returning a broken phone to a shop in Seville"
            placeholderTextColor={C.muted} keyboardAppearance="dark" style={[ui.input, { minHeight: 64 }]} />
          <Button label="Start this scene" disabled={custom.trim().length < 4} style={{ alignSelf: 'flex-start' }}
            onPress={() => start({ id: 'custom', t: custom.trim().slice(0, 40), s: custom.trim(), lvl: 1, role: `the most natural conversation partner for this scene: ${custom.trim()}` })} />
        </Card>
      </ScrollView>
    );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView ref={scroll} contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive"
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
        <View style={[ui.row, { justifyContent: 'space-between', flexWrap: 'nowrap' }]}>
          <View style={{ flex: 1 }}>
            <Eyebrow>Rol · {lvLabel(S.level)}</Eyebrow>
            <H size={22} style={{ marginTop: 2 }}>{scen.t}</H>
          </View>
          <Button kind="ghost" label="End scene" onPress={() => { setScen(null); setMsgs([]); }} />
        </View>
        <View style={styles.chat}>
          {msgs.map((m, i) =>
            m.who === 'ai' ? <AiBubble key={i} m={m} /> : (
              <View key={i} style={{ gap: 6, alignItems: 'flex-end' }}>
                <LinearGradient colors={GOLD_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.msg, styles.me]}>
                  <Text style={{ fontFamily: F.bodyMedium, fontSize: 16, color: C.onGold }}>{m.text}</Text>
                </LinearGradient>
                <Correction m={m} />
              </View>
            ),
          )}
          {busy && <View style={[styles.msg, styles.ai]}><Loading label="" /></View>}
          {!!err && <Text style={ui.nudge}>{err}</Text>}
        </View>
        <View style={{ marginTop: 12, gap: 8 }}>
          <SpanishInput value={text} onChangeText={setText} onSubmit={send} placeholder="Responde en español…" minHeight={56}
            accessibilityLabel="Your reply in Spanish" />
          <Button label="Send" onPress={send} disabled={busy} style={{ alignSelf: 'flex-end' }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 220 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  scen: { width: '48%', flexGrow: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 14, gap: 4 },
  scenLv: { fontFamily: F.bodyBold, fontSize: 11, letterSpacing: 1, color: C.gold },
  scenT: { fontFamily: F.display, fontSize: 18, color: C.ink },
  scenS: { fontFamily: F.body, fontSize: 13, color: C.muted },
  chat: { gap: 10, marginTop: 14 },
  msg: { maxWidth: '86%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  ai: { alignSelf: 'flex-start', backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderBottomLeftRadius: 6 },
  me: { alignSelf: 'flex-end', borderBottomRightRadius: 6 },
  tr: { color: C.muted, fontSize: 13, marginTop: 4 },
  corr: { maxWidth: '86%', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, gap: 4 },
});
