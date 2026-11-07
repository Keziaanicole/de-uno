// Grammar library: every topic by level, with status that updates as you practice.
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Eyebrow, H, Meter, Rich, T, Tag, s as ui } from '../components/ui';
import { LV, TOPIC, TOPICS, type Block } from '../lib/content';
import { fold, mastery, topicStatus, type TopicStatus } from '../lib/engine';
import { useStore } from '../lib/store';
import { C, F } from '../lib/theme';

const PILL: Record<TopicStatus, [string, string, string]> = {
  done: [C.ok, C.okBg, 'transparent'],
  prog: [C.warn, C.warnBg, 'transparent'],
  new: [C.muted, C.surface2, 'transparent'],
  later: [C.muted, 'transparent', C.line],
};
export function Pill({ status, label }: { status: TopicStatus; label: string }) {
  const [fg, bg, border] = PILL[status];
  return <Text style={[styles.pill, { color: fg, backgroundColor: bg, borderColor: border }]}>{label}</Text>;
}

export default function Grammar({ onOpenTopic }: { onOpenTopic: (id: string) => void }) {
  const { S } = useStore();
  const [q, setQ] = useState('');
  const done = TOPICS.filter((t) => mastery(S, t.id) >= 0.8).length;
  const prog = TOPICS.filter((t) => S.skills[t.id]?.seen && mastery(S, t.id) < 0.8).length;
  const fq = fold(q);

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <Eyebrow>Gramática</Eyebrow>
      <H size={30} style={{ marginTop: 4 }}>Your grammar library</H>
      <T style={[ui.muted, { fontSize: 14, marginTop: 6 }]}>Every topic, in order of level. Status updates on its own as you practice.</T>
      <View style={styles.stats}>
        {[[done, 'mastered'], [prog, 'in progress'], [TOPICS.length, 'topics']].map(([v, l]) => (
          <View key={String(l)} style={styles.stat}>
            <Text style={styles.statNum}>{v}</Text>
            <Text style={styles.statLbl}>{l}</Text>
          </View>
        ))}
      </View>
      <TextInput value={q} onChangeText={setQ} placeholder="Search: subjuntivo, por, pretérito…" placeholderTextColor={C.muted}
        style={styles.search} keyboardAppearance="dark" accessibilityLabel="Search grammar" clearButtonMode="while-editing" />
      {[1, 2, 3, 4, 5].map((l) => {
        const ts = TOPICS.filter((t) => t.lvl === l && (!fq || fold(`${t.t} ${t.s}`).includes(fq)));
        if (!ts.length) return null;
        const lm = ts.filter((t) => mastery(S, t.id) >= 0.8).length;
        return (
          <View key={l}>
            <View style={styles.lvlHead}>
              <View style={ui.row}>
                <H size={24}>{LV[l]}</H>
                {Math.floor(S.level) === l && <Pill status="prog" label="your level" />}
              </View>
              <Text style={styles.statLbl}>{lm} / {ts.length} mastered</Text>
            </View>
            <View style={styles.list}>
              {ts.map((t, i) => {
                const [st, lab] = topicStatus(S, t);
                return (
                  <Pressable key={t.id} onPress={() => onOpenTopic(t.id)} accessibilityRole="button"
                    style={({ pressed }) => [styles.topic, i > 0 && styles.topicBorder, pressed && { backgroundColor: C.surface2 }]}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.topicT}>{t.t}</Text>
                      <Text style={styles.topicS}>{t.s}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <Pill status={st} label={lab} />
                      <Meter value={mastery(S, t.id)} width={46} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
      {!TOPICS.some((t) => !fq || fold(`${t.t} ${t.s}`).includes(fq)) && <T style={ui.muted}>No topic matches that search.</T>}
    </ScrollView>
  );
}

function BlockView({ b }: { b: Block }) {
  if (b.k === 'p') return <Rich text={b.t} />;
  if (b.k === 'warn') return <View style={styles.warn}><Rich text={`**Watch out:** ${b.t}`} style={{ fontSize: 15 }} /></View>;
  if (b.k === 'ex')
    return (
      <View style={{ gap: 6 }}>
        {b.items.map(([es, en], i) => (
          <View key={i} style={styles.ex}>
            <T>{es}</T>
            <T style={[ui.muted, { fontSize: 14 }]}>{en}</T>
          </View>
        ))}
      </View>
    );
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.table}>
        {[b.h, ...b.r].map((row, ri) => (
          <View key={ri} style={[styles.tr, ri > 0 && { borderTopWidth: 1, borderTopColor: C.line }]}>
            {row.map((cell, ci) => (
              <View key={ci} style={[styles.td, { width: row.length > 3 ? 104 : 130 }]}>
                {ri === 0 ? <Text style={styles.th}>{cell}</Text> : <Rich text={cell} style={{ fontSize: 15 }} />}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function TopicSheet({ id, onClose, onPractice }: { id: string | null; onClose: () => void; onPractice: (id: string) => void }) {
  const { S } = useStore();
  const insets = useSafeAreaInsets();
  const t = id ? TOPIC[id] : null;
  return (
    <Modal visible={!!t} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      {t && (
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          <ScrollView contentContainerStyle={[styles.sheet, { paddingBottom: insets.bottom + 110 }]}>
            <View style={ui.row}>
              <Tag label={LV[t.lvl]} />
              <Pill status={topicStatus(S, t)[0]} label={topicStatus(S, t)[1]} />
            </View>
            <H size={28}>{t.t}</H>
            <T style={ui.muted}>{t.s}</T>
            {t.blocks.map((b, i) => <BlockView key={i} b={b} />)}
          </ScrollView>
          <View style={[styles.sheetBar, { paddingBottom: insets.bottom + 12 }]}>
            <Button label="Practice this now" onPress={() => onPractice(t.id)} style={{ flex: 1 }} />
            <Button kind="ghost" label="Close" onPress={onClose} />
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 220 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 12 },
  stat: { flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 12 },
  statNum: { fontFamily: F.display, fontSize: 24, color: C.goldHi },
  statLbl: { fontFamily: F.bodySemi, fontSize: 12, color: C.muted },
  search: { marginTop: 14, borderWidth: 1.5, borderColor: C.line, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, backgroundColor: C.surface, color: C.ink, fontFamily: F.body, fontSize: 16 },
  lvlHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24, marginBottom: 8 },
  list: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 18, overflow: 'hidden' },
  topic: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  topicBorder: { borderTopWidth: 1, borderTopColor: C.line },
  topicT: { fontFamily: F.bodyBold, fontSize: 16, color: C.ink },
  topicS: { fontFamily: F.body, fontSize: 13, color: C.muted, marginTop: 2 },
  pill: { fontFamily: F.bodyBold, fontSize: 11, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, overflow: 'hidden', borderWidth: 1 },
  sheet: { padding: 20, gap: 12 },
  sheetBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.bg },
  warn: { backgroundColor: C.warnBg, borderRadius: 12, padding: 12 },
  ex: { backgroundColor: C.surface, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  table: { backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: C.line },
  tr: { flexDirection: 'row' },
  td: { paddingHorizontal: 10, paddingVertical: 8 },
  th: { fontFamily: F.bodyBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: C.muted },
});
