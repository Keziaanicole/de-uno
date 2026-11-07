// Gold stars and champagne bubbles that burst from a point on screen.
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import { onBurst, type Burst } from '../lib/sparkle';

const COLORS = ['#e3c98f', '#f6e7c1', '#a68b5b', '#fff6e0', '#c9ad78'];
type P = { kind: 'star' | 'bubble'; dx: number; dy: number; fall: number; size: number; color: string; spin: number; delay: number };
type Shot = { id: number; x: number; y: number; parts: P[]; t: Animated.Value };

function makeParts(big?: boolean): P[] {
  const parts: P[] = [];
  const n = big ? 60 : 38;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * (big ? 190 : 130);
    parts.push({ kind: 'star', dx: Math.cos(a) * d, dy: Math.sin(a) * d - 30, fall: 60 + Math.random() * 80,
      size: 10 + Math.random() * 14, color: COLORS[i % COLORS.length], spin: (Math.random() - 0.5) * 4, delay: 0 });
  }
  for (let i = 0; i < 16; i++)
    parts.push({ kind: 'bubble', dx: (Math.random() - 0.5) * 140, dy: -(120 + Math.random() * 160), fall: 0,
      size: 4 + Math.random() * 8, color: '#f6e7c1', spin: 0, delay: Math.random() * 0.25 });
  return parts;
}

export default function SparkleLayer() {
  const [shots, setShots] = useState<Shot[]>([]);
  const reduce = useRef(false);
  const nextId = useRef(1);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { reduce.current = v; });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => { reduce.current = v; });
    const off = onBurst((b: Burst) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      if (reduce.current) return;
      const shot: Shot = { id: nextId.current++, x: b.x, y: b.y, parts: makeParts(b.big), t: new Animated.Value(0) };
      setShots((s) => [...s, shot]);
      Animated.timing(shot.t, { toValue: 1, duration: 1600, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(() =>
        setShots((s) => s.filter((x) => x.id !== shot.id)),
      );
    });
    return () => { off(); sub.remove(); };
  }, []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {shots.map((shot) =>
        shot.parts.map((p, i) => {
          const start = p.delay;
          const tx = shot.t.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] });
          const ty = p.kind === 'star'
            ? shot.t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, p.dy, p.dy + p.fall] })
            : shot.t.interpolate({ inputRange: [0, start, 1], outputRange: [40, 40, 40 + p.dy] });
          const opacity = shot.t.interpolate({ inputRange: [0, 0.08, 0.7, 1], outputRange: [0, 1, 0.8, 0] });
          const scale = shot.t.interpolate({ inputRange: [0, 0.15, 0.3, 0.45, 1], outputRange: [0.2, 1.2, 0.7, 1.1, 0.5] });
          const rotate = shot.t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.spin * 180}deg`] });
          return (
            <Animated.Text
              key={`${shot.id}-${i}`}
              style={{
                position: 'absolute', left: shot.x - p.size / 2, top: shot.y - p.size / 2, opacity,
                transform: [{ translateX: tx }, { translateY: ty }, { scale }, { rotate }],
                ...(p.kind === 'star'
                  ? { color: p.color, fontSize: p.size, lineHeight: p.size * 1.2 }
                  : { width: p.size, height: p.size, borderRadius: p.size, borderWidth: 1, borderColor: p.color }),
              }}
            >
              {p.kind === 'star' ? '✦' : ''}
            </Animated.Text>
          );
        }),
      )}
    </View>
  );
}
