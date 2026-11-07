// Level, stats, daily goal, watched mistakes, and account actions.
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Eyebrow, H, T, s as ui } from '../components/ui';
import { LV } from '../lib/content';
import { lvLabel, lvProgress } from '../lib/engine';
import { useStore } from '../lib/store';
import { C, F } from '../lib/theme';

export default function StatsSheet({ visible, onClose, onRetake }: { visible: boolean; onClose: () => void; onRetake: () => void }) {
  const { S, update, reset, signOut, session } = useStore();
  const insets = useSafeAreaInsets();
  const [confirm, setConfirm] = useState(false);
  const st = S.stats, acc = st.total ? Math.round((st.good / st.total) * 100) : 0, cur = Math.floor(S.level);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={[styles.wrap, { paddingBottom: insets.bottom + 40 }]}>
        <View style={[ui.row, { justifyContent: 'space-between' }]}>
          <Eyebrow>Tu nivel</Eyebrow>
          <Button kind="link" label="Close" onPress={onClose} />
        </View>
        <H size={28}>{lvLabel(S.level)} · {Math.round(lvProgress(S.level) * 100)}% to {LV[cur + 1] ?? 'mastery'}</H>
        <View style={styles.cefr}>
          {LV.slice(1).map((l, i) => <Text key={l} style={[styles.cell, i + 1 === cur && styles.cellOn]}>{l}</Text>)}
        </View>
        <View style={styles.stats}>
          {[[st.total, 'sentences'], [`${acc}%`, 'fully correct'], [st.streak || 0, 'day streak']].map(([v, l]) => (
            <View key={String(l)} style={styles.stat}>
              <Text style={styles.num}>{v}</Text>
              <Text style={styles.lbl}>{l}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.h3, { marginTop: 18 }]}>Daily goal</Text>
        <View style={ui.row}>
          {[10, 20, 30, 50].map((g) => (
            <Pressable key={g} onPress={() => update((s) => { s.stats.goal = g; })} accessibilityRole="button"
              accessibilityState={{ selected: (st.goal || 20) === g }}
              style={[styles.goal, (st.goal || 20) === g && { borderColor: C.goldHi, backgroundColor: C.surface2 }]}>
              <Text style={{ fontFamily: F.bodyBold, color: C.ink }}>{g}</Text>
            </Pressable>
          ))}
        </View>

        {S.mist.length > 0 && (
          <>
            <Text style={[styles.h3, { marginTop: 18 }]}>Mistakes De Uno is watching</Text>
            {S.mist.slice(0, 6).map((m, i) => (
              <View key={i} style={styles.mist}>
                <T><Text style={{ textDecorationLine: 'line-through', color: C.bad }}>{m.wrong}</Text>  →  <Text style={{ fontFamily: F.bodyBold }}>{m.right}</Text></T>
                {!!m.why && <T style={[ui.muted, { fontSize: 14 }]}>{m.why}</T>}
              </View>
            ))}
          </>
        )}

        <T style={[ui.muted, { fontSize: 14, marginTop: 16 }]}>
          Your level moves with every answer: good answers on harder topics push it up, repeated slips pull it back, and missed topics come back for review.
        </T>
        <View style={{ gap: 10, marginTop: 14 }}>
          <Button kind="ghost" label="Retake the level check" onPress={() => { update((s) => { s.placed = false; }); onRetake(); }} />
          {!confirm ? (
            <Button kind="link" label="Reset all progress" onPress={() => setConfirm(true)} />
          ) : (
            <View style={{ gap: 8 }}>
              <T style={{ fontSize: 14 }}>This erases your level, history and streak.</T>
              <View style={ui.row}>
                <Button label="Erase everything" onPress={() => { reset(); setConfirm(false); onRetake(); }} />
                <Button kind="ghost" label="Keep my progress" onPress={() => setConfirm(false)} />
              </View>
            </View>
          )}
          <Text style={[styles.lbl, { marginTop: 10 }]}>{session ? `Signed in as ${session.user.email}` : 'Offline mode: progress is saved on this phone only.'}</Text>
          <Button kind="link" label={session ? 'Sign out' : 'Leave offline mode'} onPress={() => { onClose(); signOut(); }} />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, gap: 10 },
  cefr: { flexDirection: 'row', gap: 4, marginTop: 4 },
  cell: { flex: 1, textAlign: 'center', fontFamily: F.display, fontSize: 13, color: C.muted, paddingVertical: 6, borderRadius: 9, overflow: 'hidden', backgroundColor: C.surface2 },
  cellOn: { backgroundColor: C.goldHi, color: C.onGold },
  stats: { flexDirection: 'row', gap: 8, marginTop: 8 },
  stat: { flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 12 },
  num: { fontFamily: F.display, fontSize: 22, color: C.goldHi },
  lbl: { fontFamily: F.bodySemi, fontSize: 12, color: C.muted },
  h3: { fontFamily: F.display, fontSize: 19, color: C.ink },
  goal: { borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 9, backgroundColor: C.surface },
  mist: { backgroundColor: C.surface, borderRadius: 12, padding: 10 },
});
