import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, type ComponentRef, type ReactNode } from 'react';
import {
  ActivityIndicator, Animated, Pressable, StyleSheet, Text, TextInput, View,
  type StyleProp, type TextInputProps, type TextProps, type TextStyle, type ViewStyle,
} from 'react-native';
import { C, F, GOLD_GRADIENT } from '../lib/theme';

export function T({ style, ...p }: TextProps) {
  return <Text {...p} style={[s.body, style]} />;
}
export function H({ size = 28, style, ...p }: TextProps & { size?: number }) {
  return <Text {...p} accessibilityRole="header" style={[s.display, { fontSize: size, lineHeight: size * 1.15 }, style]} />;
}
export function Eyebrow({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[s.eyebrow, style]}>{children}</Text>;
}

export function Button({ label, onPress, kind = 'gold', disabled, style }: {
  label: string; onPress: () => void; kind?: 'gold' | 'ghost' | 'link'; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  if (kind === 'link')
    return (
      <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button" style={style}>
        <Text style={s.link}>{label}</Text>
      </Pressable>
    );
  const inner = <Text style={[s.btnText, kind === 'ghost' && { color: C.ink, fontFamily: F.bodySemi }]}>{label}</Text>;
  return (
    <Pressable
      onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityState={{ disabled }}
      style={({ pressed }) => [{ opacity: disabled ? 0.5 : pressed ? 0.85 : 1, borderRadius: 14 }, style]}
    >
      {kind === 'gold' ? (
        <LinearGradient colors={GOLD_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.btn}>{inner}</LinearGradient>
      ) : (
        <View style={[s.btn, s.ghost]}>{inner}</View>
      )}
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Tag({ label, highlight, onPress }: { label: string; highlight?: boolean; onPress?: () => void }) {
  const el = <Text style={[s.tag, highlight && s.tagHi]}>{label}</Text>;
  return onPress ? <Pressable onPress={onPress} accessibilityRole="button">{el}</Pressable> : el;
}

export function Meter({ value, width, height = 6 }: { value: number; width?: number; height?: number }) {
  return (
    <View style={{ width, flex: width ? undefined : 1, height, borderRadius: height, backgroundColor: C.surface2, overflow: 'hidden' }}>
      <LinearGradient colors={GOLD_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`, height: '100%' }} />
    </View>
  );
}

export function Loading({ label }: { label: string }) {
  const a = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(a, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(a, { toValue: 0.4, duration: 600, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [a]);
  return (
    <View style={s.loading} accessibilityLiveRegion="polite">
      <ActivityIndicator color={C.goldHi} />
      <Animated.Text style={[s.loadingText, { opacity: a }]}>{label}</Animated.Text>
    </View>
  );
}

/** Renders **bold** and _italic_ inline markup from the grammar content. */
export function Rich({ text, style }: { text: string; style?: StyleProp<TextStyle> }) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).filter(Boolean);
  return (
    <Text style={[s.body, style]}>
      {parts.map((p, i) =>
        p.startsWith('**') ? <Text key={i} style={{ fontFamily: F.bodyBold, color: C.goldHi }}>{p.slice(2, -2)}</Text>
        : p.startsWith('_') ? <Text key={i} style={{ fontStyle: 'italic', color: C.goldPale }}>{p.slice(1, -1)}</Text>
        : p,
      )}
    </Text>
  );
}

const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];

/** Multiline Spanish input with an accent-key row that inserts at the cursor. */
export function SpanishInput({ value, onChangeText, onSubmit, placeholder, minHeight = 96, ...rest }: TextInputProps & {
  value: string; onChangeText: (s: string) => void; onSubmit?: () => void; minHeight?: number;
}) {
  const sel = useRef({ start: value.length, end: value.length });
  const ref = useRef<ComponentRef<typeof TextInput>>(null);
  const insert = (ch: string) => {
    const { start, end } = sel.current;
    const next = value.slice(0, start) + ch + value.slice(end);
    onChangeText(next);
    sel.current = { start: start + ch.length, end: start + ch.length };
    ref.current?.focus();
  };
  return (
    <View style={{ gap: 8 }}>
      <TextInput
        ref={ref} value={value} onChangeText={onChangeText} multiline placeholder={placeholder}
        placeholderTextColor={C.muted} selectionColor={C.goldHi} autoCorrect={false} autoCapitalize="sentences"
        keyboardAppearance="dark" submitBehavior="blurAndSubmit" returnKeyType="send" onSubmitEditing={onSubmit}
        onSelectionChange={(e) => { sel.current = e.nativeEvent.selection; }}
        style={[s.input, { minHeight }]} {...rest}
      />
      <View style={s.keys}>
        {ACCENTS.map((ch) => (
          <Pressable key={ch} onPress={() => insert(ch)} style={({ pressed }) => [s.key, pressed && { backgroundColor: C.line }]}
            accessibilityRole="button" accessibilityLabel={`Insert ${ch}`}>
            <Text style={s.keyText}>{ch}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export const s = StyleSheet.create({
  body: { fontFamily: F.body, color: C.ink, fontSize: 16, lineHeight: 23 },
  display: { fontFamily: F.display, color: C.ink },
  eyebrow: { fontFamily: F.bodyBold, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: C.muted },
  muted: { color: C.muted },
  btn: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  ghost: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line },
  btnText: { fontFamily: F.bodyBold, fontSize: 16, color: C.onGold },
  link: { fontFamily: F.bodySemi, fontSize: 14, color: C.muted, textDecorationLine: 'underline' },
  card: {
    backgroundColor: C.surface, borderRadius: 22, borderWidth: 1, borderColor: C.line, padding: 18,
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 10 },
  },
  tag: {
    fontFamily: F.bodyBold, fontSize: 12, color: C.muted, backgroundColor: C.surface2, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 4, overflow: 'hidden', alignSelf: 'flex-start',
  },
  tagHi: { color: C.goldHi, borderWidth: 1, borderColor: C.gold },
  loading: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 18 },
  loadingText: { fontFamily: F.bodySemi, color: C.muted, fontSize: 15 },
  input: {
    fontFamily: F.body, fontSize: 17, lineHeight: 24, color: C.ink, backgroundColor: C.bg, borderWidth: 1.5,
    borderColor: C.line, borderRadius: 16, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12, textAlignVertical: 'top',
  },
  keys: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  key: { minWidth: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' },
  keyText: { fontFamily: F.bodySemi, fontSize: 16, color: C.ink },
  nudge: { fontFamily: F.bodySemi, fontSize: 14, color: C.bad },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
});
