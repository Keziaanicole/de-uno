import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { C, F } from '../lib/theme';

export type Tab = 'grammar' | 'practice' | 'roleplay';

function Icon({ tab, color }: { tab: Tab; color: string }) {
  const p = { stroke: color, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      {tab === 'grammar' && (<>
        <Path {...p} d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
        <Path {...p} d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /><Path {...p} d="M8 8h8M8 12h6" />
      </>)}
      {tab === 'practice' && (<>
        <Rect {...p} x={3} y={6} width={14} height={15} rx={3} />
        <Path {...p} d="M7 3h11a3 3 0 0 1 3 3v11" /><Path {...p} d="M7 12h6M7 16h4" />
      </>)}
      {tab === 'roleplay' && (<>
        <Path {...p} d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
        <Path {...p} d="M17 9h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-4-3h-3" />
      </>)}
    </Svg>
  );
}

const LABELS: Record<Tab, string> = { grammar: 'Gramática', practice: 'Práctica', roleplay: 'Rol' };

export default function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]} accessibilityRole="tablist">
      {(Object.keys(LABELS) as Tab[]).map((t) => {
        const on = t === tab;
        return (
          <Pressable key={t} onPress={() => onChange(t)} accessibilityRole="tab" accessibilityState={{ selected: on }}
            style={[styles.tab, on && { backgroundColor: C.surface2 }]}>
            <Icon tab={t} color={on ? C.goldHi : C.muted} />
            <Text style={[styles.label, { color: on ? C.goldHi : C.muted }]}>{LABELS[t]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingTop: 6, backgroundColor: 'rgba(20,14,10,0.96)', borderTopWidth: 1, borderTopColor: C.line },
  tab: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 7, borderRadius: 14 },
  label: { fontFamily: F.bodySemi, fontSize: 12 },
});
