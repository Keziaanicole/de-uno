import { useRef, type ComponentRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { diffWords, fold, type Card, type DiffTok, type Grade } from '../lib/engine';
import { burst } from '../lib/sparkle';
import { C, F } from '../lib/theme';
import { s as ui } from './ui';

const TITLES = { correct: '¡Salud! Perfecto.', almost: 'Casi', incorrect: 'Not quite' };

export function DiffText({ toks, style }: { toks: DiffTok[]; style?: object }) {
  return (
    <Text style={[st.sent, style]}>
      {toks.map((t, i) => (
        <Text key={i}>
          {i ? ' ' : ''}
          <Text style={t.mark === 'del' ? st.del : t.mark === 'ins' ? st.ins : undefined}>{t.w}</Text>
        </Text>
      ))}
    </Text>
  );
}

/** Sparkles once, from wherever this view lands on screen. */
export function useSparkleOnLayout(active: boolean, big = false) {
  const ref = useRef<ComponentRef<typeof View>>(null);
  const done = useRef(false);
  const onLayout = () => {
    if (!active || done.current) return;
    done.current = true;
    requestAnimationFrame(() => ref.current?.measureInWindow((x, y, w, h) => burst({ x: x + Math.min(w, 180) / 2, y: y + h / 2, big })));
  };
  return { ref, onLayout };
}

export default function Feedback({ ans, r, card }: { ans: string; r: Grade; card: Card }) {
  const spark = useSparkleOnLayout(r.verdict === 'correct');
  const corrected = r.corrected || card.answer || '';
  const showDiff = r.verdict !== 'correct' && corrected && fold(corrected) !== fold(ans) || (r.verdict === 'almost' && !!corrected);
  const [u, c] = diffWords(ans, corrected || ans);
  const tone = { correct: [C.goldHi, '#251d12'], almost: [C.warn, C.warnBg], incorrect: [C.bad, C.badBg] }[r.verdict];
  const other = r.better && fold(r.better) !== fold(corrected) ? ['More natural', r.better]
    : r.verdict !== 'correct' && card.answer && fold(card.answer) !== fold(corrected) ? ['Another way to say it', card.answer] : null;

  return (
    <View style={[st.box, { backgroundColor: tone[1], borderColor: r.verdict === 'correct' ? C.gold : 'transparent' }]} accessibilityLiveRegion="polite">
      <View ref={spark.ref} onLayout={spark.onLayout} collapsable={false}>
        <Text style={[st.verdict, { color: tone[0] }]}>{TITLES[r.verdict]}</Text>
      </View>
      <View>
        <Text style={st.lbl}>You wrote</Text>
        {showDiff ? <DiffText toks={u} /> : <Text style={st.sent}>{ans}</Text>}
      </View>
      {showDiff && (
        <View>
          <Text style={st.lbl}>Corrected</Text>
          <DiffText toks={c} />
        </View>
      )}
      {r.mistakes?.length > 0 && (
        <View style={{ gap: 6 }}>
          {r.mistakes.map((m, i) => (
            <View key={i} style={st.mist}>
              <Text style={ui.body}>
                <Text style={st.del}>{m.wrong}</Text>  →  <Text style={{ fontFamily: F.bodyBold }}>{m.right}</Text>
              </Text>
              <Text style={[ui.body, ui.muted, { fontSize: 14 }]}>{m.why}</Text>
            </View>
          ))}
        </View>
      )}
      {other && (
        <View>
          <Text style={st.lbl}>{other[0]}</Text>
          <Text style={st.sent}>{other[1]}</Text>
        </View>
      )}
      {!!r.tip && <Text style={[ui.body, { fontSize: 14 }]}>{r.tip}</Text>}
    </View>
  );
}

const st = StyleSheet.create({
  box: { marginTop: 16, borderRadius: 18, padding: 16, gap: 10, borderWidth: 1 },
  verdict: { fontFamily: F.display, fontSize: 22 },
  lbl: { fontFamily: F.bodyBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: C.muted, marginBottom: 2 },
  sent: { fontFamily: F.body, fontSize: 17, lineHeight: 24, color: C.ink },
  del: { textDecorationLine: 'line-through', color: C.bad },
  ins: { fontFamily: F.bodyBold, color: C.ok, textDecorationLine: 'underline' },
  mist: { backgroundColor: C.surface, borderRadius: 12, padding: 10 },
});
